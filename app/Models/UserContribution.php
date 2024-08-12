<?php

namespace App\Models;

use CodeIgniter\Model;

class UserContribution extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'user_contributions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $insertID         = 0;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'subscriber_id',
        'contributor_id',
        'roll_over_month',
        'roll_over_bill'
    ];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];


    public function report($filters)
    {
        $userData = getTokenUser();
        $subscriberID = $userData['subscriber_id'];
        $userSelection = getSelectedCompany();
        $defaultStart = $userSelection->start_date;
        $defaultEnd = $userSelection->end_date;
        $userType = $userData['user_type'];
        $userID = $filters['employee_id'];
        $companyID = $userSelection->company_id;
        $companyIDs = [$companyID];
        $time   = strtotime($userSelection->start_date);
        $last   = date('M-Y', strtotime($userSelection->end_date));

        $monthName = [];
        do {
            $month = date('M-Y', $time);
            $monthYear[] = date('Y-m', $time);
            $monthName[] = $month;
            $time = strtotime('+1 month', $time);
        } while ($month != $last);

        $newMonthDate = [];
        foreach ($monthYear as $key => $vl) {
            if ($key === array_key_first($monthYear)) {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-d', strtotime($userSelection->start_date)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            } else if ($key === array_key_last($monthYear)) {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-d', strtotime($userSelection->end_date)),
                ];
            } else {
                $newMonthDate[] = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            }
        }

        $clientBuilder = $this->builder('clients');
        $clientBuilder->select('clients.id, clients.client_name, clients.company_name');
        if ($companyID === '0') {
            $clientBuilder->join('client_contributed_user', 'client_contributed_user.client_id=clients.id', 'LEFT');
            $clientBuilder->where('client_contributed_user.contributor_id', $userID);
            $clientBuilder->where('clients.subscriber_id', $subscriberID);
        } else {
            $clientBuilder->join('company_clients', 'company_clients.client_id=clients.id', 'LEFT');
            $clientBuilder->join('client_contributed_user', 'client_contributed_user.client_id=clients.id', 'LEFT');
            $clientBuilder->where('client_contributed_user.contributor_id', $userID);
            $clientBuilder->whereIn('company_clients.company_id', $companyIDs);
        }
        $clientList = $clientBuilder->get()->getResultArray();



        $contributionBuilder = $this->builder('user_contributions');
        $contributionBuilder->where('contributor_id', $userID);
        $contributionData = $contributionBuilder->get()->getRowArray();


        foreach ($clientList as $key => $value) :
            $monthAmount = [];

            $invoiceIDs = model(Invoice::class)->where('client_id', $value['id'])->where("invoice_date BETWEEN '$defaultStart' AND '$defaultEnd'")->findColumn('id');

            foreach ($newMonthDate as $k => $dates) {
                $startDate = $dates['start_date'];
                $endDate = $dates['end_date'];

                if ($contributionData) {
                    $rollOverMonth = $contributionData['roll_over_month'];

                    $paymentBuilder = $this->builder('invoice_payments AS IP');
                    $paymentBuilder->select("SUM(CASE WHEN (IP.company_currency_amount BETWEEN CS.from AND CS.to) THEN
                    IF(CS.amount_type='Flat',CS.amount,IP.amount_without_tax * CS.amount / 100) ELSE 0 END
                    ) AS TotalAmount");
                    $paymentBuilder->join('invoices AS I', 'I.id=IP.invoice_id', 'LEFT');
                    $paymentBuilder->join('contribution_slabs AS CS', 'CS.user_contribution_id=' . $contributionData['id'], 'LEFT');

                    if ($rollOverMonth != '0') {
                        $paymentBuilder->where("IP.payment_date BETWEEN DATE(I.invoice_date) AND DATE_ADD(I.invoice_date,INTERVAL $rollOverMonth month)");
                    } else {
                        $paymentBuilder->limit($contributionData['roll_over_bill'], 0);
                    }

                    $paymentBuilder->where("IP.payment_date BETWEEN '$startDate' AND '$endDate' ");
                    $paymentBuilder->whereIn('IP.invoice_id', empty($invoiceIDs) ? [0] : $invoiceIDs);
                    $paymentBuilder->groupBy('IP.invoice_id');
                    $paymentData = $paymentBuilder->get()->getRowArray();
                    if ($paymentData) {
                        $monthAmount[] = number_format((float)$paymentData['TotalAmount'], 2, '.', '');
                    } else {
                        $monthAmount[] = number_format((float)0, 2, '.', '');
                    }
                } else {
                    $monthAmount[] = number_format((float)0, 2, '.', '');
                }
            }

            $clientList[$key]['monthData'] = $monthAmount;
        endforeach;

        $output = [
            'months' => $monthName,
            'clientData' => $clientList,
        ];


        return $output;
    }

    public function getClientPaymentByDate($invoiceIDs, $date)
    {
        $startDate = $date['start_date'];
        $endDate = $date['end_date'];

        $builder = $this->db->table('invoice_payments');
        $builder->select('invoice_payments.invoice_id,SUM(invoice_payments.company_currency_amount)');
        $builder->select('invoice_payments.*');
        $builder->join('user_contributions', 'user_contributions.user_id = 9');
        $builder->join('contribution_slabs', 'contribution_slabs.user_contribution_id = user_contributions.id');
        $builder->where("invoice_payments.payment_date BETWEEN '$startDate' AND '$endDate'");
        $builder->where("invoice_payments.company_currency_amount BETWEEN contribution_slabs.from AND contribution_slabs.to");
        $builder->whereIn('invoice_payments.invoice_id', $invoiceIDs);
        $builder->groupBy('invoice_payments.invoice_id');
        $query = $builder->get()->getResultArray();

        // $output
        return $query;
    }
}
