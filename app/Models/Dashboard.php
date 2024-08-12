<?php

namespace App\Models;

use CodeIgniter\Model;

class Dashboard extends Model
{

    /*************************************************************
     *                        Write Query                        *
     * 
     * Write a query for dashboard data
     * All custom query write in private function
     */


    private function SUB_DASHBOARD_CARD($userData, $companyData, $dates = [])
    {
        $companyID = $companyData->company_id;
        $startDate = !empty($dates) ? $dates['start_date'] : $companyData->start_date;
        $endDate = !empty($dates) ? $dates['end_date'] : $companyData->end_date;
        $userID = $userData['id'];
        $subscriberID = $userData['subscriber_id'];
        $userType = $userData['user_type'];

        $builder = $this->builder('invoices');
        # Invoice Count 

        if ($userType === 'Subscriber' && $companyID === '0') {
            $builder->select("COUNT(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN invoices.id END) AS InvoiceCount");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN invoices.subscriber_currency_total_amount ELSE 0 END) AS TotalSales");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN (invoices.total_tax_amount * invoices.subscriber_currency_conversion_rate) ELSE 0 END) AS TotalTax");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN (invoices.subtotal  * invoices.subscriber_currency_conversion_rate) ELSE 0 END) AS SubTotal");
            $builder->select("SUM(CASE WHEN(
                invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID
                AND (invoices.invoice_status != 'Paid' OR invoices.invoice_status != 'Bed Debt')) 
                THEN ((invoices.invoice_currency_total_amount - invoices.invoice_currency_amount_received) * invoices.subscriber_currency_conversion_rate)
                ELSE 0 END) AS Due");

            $builder->select("SUM(CASE WHEN(
                invoices.subscriber_id = $subscriberID AND
                invoices.invoice_date >= DATE_SUB('$startDate', INTERVAL 1 YEAR) 
                AND (invoices.invoice_date <= DATE_SUB('$endDate', INTERVAL 1 YEAR))) 
                THEN ((invoices.invoice_currency_total_amount - invoices.invoice_currency_amount_received) * invoices.subscriber_currency_conversion_rate)
                ELSE 0 END) AS PreviousYearDue");
            $builder->where('invoices.subscriber_id', $subscriberID);
            $builder->groupBy('invoices.subscriber_id');
        } else {
            $builder->select("COUNT(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN invoices.id END) AS InvoiceCount");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN invoices.company_currency_total_amount ELSE 0 END) AS TotalSales");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN (invoices.total_tax_amount * invoices.currency_conversion_rate) ELSE 0 END) AS TotalTax");
            $builder->select("SUM(CASE WHEN(invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN (invoices.subtotal * invoices.currency_conversion_rate) ELSE 0 END) AS SubTotal");
            $builder->select("SUM(CASE WHEN(
                invoices.invoice_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID
                AND (invoices.invoice_status != 'Paid' OR invoices.invoice_status != 'Bed Debt') 
                AND (invoices.company_id = $companyID)
                ) THEN invoices.total_remaining_amount 
                ELSE 0 END) AS Due");
            $builder->select("SUM(CASE WHEN(invoices.company_id = $companyID AND invoices.invoice_date >= DATE_SUB('$startDate', INTERVAL 1 YEAR) AND (invoices.invoice_date <= DATE_SUB('$endDate', INTERVAL 1 YEAR))) THEN invoices.total_remaining_amount ELSE 0 END) AS PreviousYearDue");
            $builder->where('invoices.company_id', $companyID);
            $builder->groupBy('invoices.company_id');
        }
        $query = $builder->get();
        $result = $query->getRowArray();



        $currencyBuilder = $this->builder('currencies');
        $currencyBuilder->select('currencies.*');
        if (($userType === 'Subscriber' && $companyID === '0')) {
            $currencyBuilder->join('subscribers', 'subscribers.currency_id=currencies.id');
            $currencyBuilder->where('subscribers.id', $subscriberID);
        } else {
            $currencyBuilder->join('companies', 'companies.currency_id=currencies.id');
            $currencyBuilder->where('companies.id', $companyID);
        }
        $newQuery = $currencyBuilder->get()->getRowArray();

        if ($result) {
            $response = [
                'InvoiceCount'      => $result['InvoiceCount'],
                'TotalSales'        => format_amount($result['TotalSales'], $newQuery['short_code'], $newQuery['locale']),
                'TotalTax'          => format_amount($result['TotalTax'], $newQuery['short_code'], $newQuery['locale']),
                'SubTotal'          => format_amount($result['SubTotal'], $newQuery['short_code'], $newQuery['locale']),
                'Due'               => format_amount($result['Due'], $newQuery['short_code'], $newQuery['locale']),
                'PreviousYearDue'   => format_amount($result['PreviousYearDue'], $newQuery['short_code'], $newQuery['locale']),
            ];
        } else {
            $response = [];
        }

        return $response;
    }

    private function SUB_DASHBOARD_CARD2($userData, $companyData, $dates = [])
    {
        $companyID = $companyData->company_id;
        $startDate = !empty($dates) ? $dates['start_date'] : $companyData->start_date;
        $endDate = !empty($dates) ? $dates['end_date'] : $companyData->end_date;
        $userID = $userData['id'];
        $subscriberID = $userData['subscriber_id'];
        $userType = $userData['user_type'];

        $builder = $this->builder('invoices');
        if ($userType === 'Subscriber' && $companyID === '0') {
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID AND (IP.status != 'Bad Dept')) THEN (IP.subscriber_ccr * IP.invoice_currency_amount) ELSE 0 END", 'Received');
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID) THEN (IP.subscriber_ccr * IP.tds) ELSE 0 END", 'Tds');
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.subscriber_id = $subscriberID AND (IP.status = 'Bad Dept')) THEN (IP.subscriber_ccr * IP.invoice_currency_amount) ELSE 0 END", 'BadDebt');
            $builder->join('invoice_payments AS IP', 'IP.invoice_id=invoices.id');
            $builder->where('invoices.subscriber_id', $subscriberID);
            $builder->groupBy('invoices.subscriber_id');
        } else {
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID AND (IP.status != 'Bad Dept')) THEN (IP.subscriber_ccr * IP.invoice_currency_amount) ELSE 0 END", 'Received');
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID) THEN (IP.subscriber_ccr * IP.tds) ELSE 0 END", 'Tds');
            $builder->selectSum("CASE WHEN(IP.payment_date BETWEEN '$startDate' AND '$endDate' AND invoices.company_id = $companyID AND (IP.status = 'Bad Dept')) THEN (IP.subscriber_ccr * IP.invoice_currency_amount) ELSE 0 END", 'BadDebt');
            $builder->join('invoice_payments AS IP', 'IP.invoice_id=invoices.id');
            $builder->where('invoices.company_id', $companyID);
            $builder->groupBy('invoices.company_id');
        }
        $query = $builder->get();
        $result = $query->getRowArray();

        $currencyBuilder = $this->builder('currencies');
        $currencyBuilder->select('currencies.*');
        if (($userType === 'Subscriber' && $companyID === '0')) {
            $currencyBuilder->join('subscribers', 'subscribers.currency_id=currencies.id');
            $currencyBuilder->where('subscribers.id', $subscriberID);
        } else {
            $currencyBuilder->join('companies', 'companies.currency_id=currencies.id');
            $currencyBuilder->where('companies.id', $companyID);
        }
        $newQuery = $currencyBuilder->get()->getRowArray();

        $response = [
            'Received'  => format_amount($result ? $result['Received'] : 0, $newQuery['short_code'], $newQuery['locale']),
            'Tds'       => format_amount($result ? $result['Tds'] : 0, $newQuery['short_code'], $newQuery['locale']),
            'BadDebt'   => format_amount($result ? $result['BadDebt'] : 0, $newQuery['short_code'], $newQuery['locale'])
        ];
        return $response;
    }




    /************************************************************
     *              Subscriber Dashboard Functions              *
     * 
     * Here Below all subscriber Function and they are use for 
     * only subscriber dashboard data 
     ************************************************************/


    # Subscriber Dashboard Card Data function
    public function SubscriberCardData($userData, $companyData)
    {
        $yearResult = $this->SUB_DASHBOARD_CARD($userData, $companyData);
        $yearPaymentResult = $this->SUB_DASHBOARD_CARD2($userData, $companyData);
        $yearlyExpenses['expenses'] = model(Expenses::class)->DateWiseExpenseSum($userData, $companyData);
        $yearlyIncomes['otherIncomes'] = model(Income::class)->DateWiseIncomesSum($userData, $companyData);

        $dates = [
            'start_date' => date('Y-m-01'),
            'end_date' => date('Y-m-t'),
        ];
        $monthResult = $this->SUB_DASHBOARD_CARD($userData, $companyData, $dates);
        $monthPaymentResult = $this->SUB_DASHBOARD_CARD2($userData, $companyData, $dates);
        $monthlyExpenses['expenses'] = model(Expenses::class)->DateWiseExpenseSum($userData, $companyData, $dates);
        $monthlyIncomes['otherIncomes'] = model(Income::class)->DateWiseIncomesSum($userData, $companyData, $dates);

        $output = [
            'month' => array_merge($monthResult, $monthPaymentResult, $monthlyExpenses, $monthlyIncomes),
            'year' => array_merge($yearResult, $yearPaymentResult, $yearlyExpenses, $yearlyIncomes),
        ];
        return $output;
    }

    /**
     * Subscriber Dashboard Selected Date Wise Card Data
     * 
     * @param array $userData 
     * @param object $companyData
     * @param array $filters
     */
    public function SubscriberDatesByCardData($userData, $companyData, $filters)
    {
        $dates = [
            'start_date' => $filters['startDate'],
            'end_date' =>  $filters['endDate'],
        ];

        $result = $this->SUB_DASHBOARD_CARD($userData, $companyData, $dates);
        $result2 =  $this->SUB_DASHBOARD_CARD2($userData, $companyData, $dates);
        $result3['expenses'] = model(Expenses::class)->DateWiseExpenseSum($userData, $companyData, $dates);

        return array_merge($result, $result2, $result3);
    }


    /**
     * Subscriber Dashboard Income Expense Card Data
     * 
     * @param array $userData 
     * @param object $companyData
     */
    public function SubscriberIncomeExpenseData($userData, $companyData)
    {
        $startDate = $companyData->start_date;
        $endDate = $companyData->end_date;
        $time   = strtotime($startDate);
        $last   = date('M-Y', strtotime($endDate));
        $monthName = [];
        do {
            $month = date('M-Y', $time);
            $monthYear[] = date('Y-m', $time);
            $monthName[] = $month;
            $time = strtotime('+1 month', $time);
        } while ($month != $last);

        $loginData = [
            'subscriber_id' => $userData['subscriber_id'],
            'company_id' => $companyData->company_id,
        ];

        $finalData = [];
        foreach ($monthYear as $key => $vl) {
            $newMonthDate = [];
            if ($key === array_key_first($monthYear)) {
                $newMonthDate = [
                    'start_date' => date('Y-m-d', strtotime($startDate)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            } else if ($key === array_key_last($monthYear)) {
                $newMonthDate = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-d', strtotime($endDate)),
                ];
            } else {
                $newMonthDate = [
                    'start_date' => date('Y-m-01', strtotime($vl)),
                    'end_date' => date('Y-m-t', strtotime($vl)),
                ];
            }

            $finalData[] = [
                'month' => date('M-Y', strtotime($vl)),
                'income' => model(Invoice::class)->DateWiseInvoiceAmount($loginData, $newMonthDate),
                'payment' => model(InvoicePayment::class)->DateWiseInvoicePaymentAmount($loginData, $newMonthDate),
                'expense' => model(Expenses::class)->getDateWiseExpenses($loginData, $newMonthDate),
                'otherIncome' => model(Income::class)->getDateWiseIncomes($loginData, $newMonthDate),
            ];
        }


        $finalData[] = [
            'month' => 'Total',
            'income' => model(Invoice::class)->DateWiseInvoiceAmount($loginData, ['start_date' => $startDate, 'end_date' => $endDate]),
            'payment' => model(InvoicePayment::class)->DateWiseInvoicePaymentAmount($loginData, ['start_date' => $startDate, 'end_date' => $endDate]),
            'expense' => model(Expenses::class)->getDateWiseExpenses($loginData, ['start_date' => $startDate, 'end_date' => $endDate]),
            'otherIncome' => model(Income::class)->getDateWiseIncomes($loginData, ['start_date' => $startDate, 'end_date' => $endDate])
        ];

        $output = $finalData;

        return $output;
    }
}
