<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Company;
use App\Models\Currency;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\InvoiceTax;
use App\Models\PaymentSource;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;

class PaymentStatusController extends BaseController
{
    use ResponseTrait;
    protected $invoicePayment;
    protected $invoice;

    public function __construct()
    {
        $this->invoicePayment = new InvoicePayment();
        $this->invoice = new Invoice();
    }

    public function index()
    {
        //
        $request    = $this->request->getGet();
        $response   = $this->invoicePayment->getResource($request);
        // $invoicePaymentStatus = $this->invoicePayment->where('invoice_id', $request['invoice_id'])->get()->getResultArray();

        // $invoiceInitials = $this->invoice->select('invoices.*,company_currency.short_code as company_short_code, company_currency.locale as company_locale,invoice_currency.short_code as invoice_short_code,invoice_currency.locale as invoice_locale')
        //     ->join('currencies as company_currency', 'company_currency.id = invoices.company_currency_id')
        //     ->join('currencies as invoice_currency', 'invoice_currency.id = invoices.invoice_currency_id')
        //     ->find($request['invoice_id']);

        // $data = [

        //     'net_amount' => ($invoiceInitials['subtotal'] - $invoiceInitials['total_discount']) * $invoiceInitials['currency_conversion_rate'],
        //     'total_tax_amount' => $invoiceInitials['total_tax_amount'] * $invoiceInitials['currency_conversion_rate'],
        //     'total_amount' => $invoiceInitials['company_currency_total_amount'],
        //     'remaining_amount' => format_amount(($invoiceInitials['company_currency_total_amount'] - ($invoicePaymentStatus['company_currency_amount'] + $invoicePaymentStatus['']))),

        //     'company_net_amount' => format_amount(($invoiceInitials['subtotal'] - $invoiceInitials['total_discount']), $invoiceInitials['company_short_code']),
        //     'company_total_tax_amount' => format_amount($invoiceInitials['total_tax_amount'], $invoiceInitials['company_short_code']),
        //     'company_total_amount' => format_amount($invoiceInitials['invoice_currency_total_amount'], $invoiceInitials['company_short_code']),
        // ];
        // // $response['payment_amount'] = $data;
        // print_r($data);
        // print_r($response);
        // print_r($invoiceInitials);
        // exit;
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function init()
    {
        global $paymentStatus;
        $userData   = getTokenUser();
        $request    = $this->request->getPost();
        $type       = $request['type'];
        $invoiceID  = $request['invoice_id'];


        $SubscriberCurrencyDetails  = model(Subscriber::class)->getCurrency($userData['subscriber_id']);
        $SubscriberSortCode         = strtolower($SubscriberCurrencyDetails['short_code']);

        $invoiceData            = $this->invoice->find($invoiceID);
        $InvoiceCurrencyDetail  = model(Currency::class)->find($invoiceData['invoice_currency_id']);
        $InvoiceCurrency        = strtolower($InvoiceCurrencyDetail['short_code']);

        $CompanyCurrencyDetails = model(Company::class)->getCurrency($invoiceData['company_id']);
        $companySortCode        = strtolower($CompanyCurrencyDetails['short_code']);

        $curl = service('curlrequest');
        $CurrencyRate = $curl->get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/$InvoiceCurrency.json");
        $body   = (array) json_decode($CurrencyRate->getBody());
        $rates  = (array) $body[$InvoiceCurrency];

        $response = [];
        $response['currency_rate'] = [
            'invoice_ccr'       => $rates[$InvoiceCurrency],
            'company_ccr'       => $rates[$companySortCode],
            'subscriber_ccr'    => $rates[$SubscriberSortCode],
            'USD_ccr'           => $rates['usd'],
        ];


        $invoiceData = $this->invoicePayment->getAddEditInvoiceDetails($invoiceID);

        $PaymentSource = new PaymentSource();
        $wayOfPayment = $PaymentSource->BySubscriber();

        $filedLabel = [
            'invoice_amount' => "Amount In Invoice Currency ($InvoiceCurrency)",
            'company_amount' => "Amount In Company Currency ($companySortCode)",
            'company_ccr' => "Company ccr ($InvoiceCurrency - to - $companySortCode)",
            'sub_ccr' => "Subscriber ccr ($InvoiceCurrency - to - $SubscriberSortCode)",
        ];

        if (isset($request['type']) && $type === 'add' && (isset($request['invoice_id']) && $invoiceID != '')) {
            $invoiceData['total_remaining_amount'] = $invoiceData['company_currency_total_amount'] - $invoiceData['total_payment_amount'];
            $data = [
                'id'                        => $invoiceData['id'],
                'invoice_date'              => $invoiceData['invoice_date'],
                'net_amount_invoice'        => format_amount($invoiceData['subtotal'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'net_amount_company'        => format_amount($invoiceData['subtotal'] * $invoiceData['currency_conversion_rate'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'tax_invoice'               => format_amount($invoiceData['total_tax_amount'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'tax_company'               => format_amount($invoiceData['total_tax_amount'] * $invoiceData['currency_conversion_rate'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'total_amount_invoice'      => format_amount($invoiceData['invoice_currency_total_amount'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'total_amount_company'      => format_amount($invoiceData['company_currency_total_amount'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'remaining_amount_invoice'  => format_amount($invoiceData['invoice_currency_total_amount'] - $invoiceData['invoice_currency_amount_received'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'remaining_amount_company'  => format_amount($invoiceData['total_remaining_amount'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'remaining_amount'          => (float) number_format((float)$invoiceData['total_remaining_amount'], 2, '.', ''),
                'invoice_status'            => $paymentStatus,
                'way_of_payment'            => $wayOfPayment,
                'filed_labels'              => $filedLabel
            ];
            $response['invoiceData'] = $data;
        } else if ((isset($request['type']) && $type === 'edit') && (isset($request['invoice_id']) && $invoiceID != '')) {
            $paymentID = $request['id'];
            $invoicePaymentData = $this->invoicePayment->find($paymentID);
            // print_r($invoicePaymentData);
            // die;

            // $subTotal = '';
            // $totalTax = '';
            // $currency_conversion_rate = '';
            // $total_tax_amount = '';
            // $invoice_currency_total_amount = '';
            // $company_currency_total_amount = '';
            // $total_remaining_amount = '';
            // $invoice_currency_amount_received = '';

            $data = [
                'id'                        => $invoiceData['id'],
                'invoice_date'              => $invoiceData['invoice_date'],
                'net_amount_invoice'        => format_amount($invoiceData['subtotal'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'net_amount_company'        => format_amount($invoiceData['subtotal'] * $invoiceData['currency_conversion_rate'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'tax_invoice'               => format_amount($invoiceData['total_tax_amount'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'tax_company'               => format_amount($invoiceData['total_tax_amount'] * $invoiceData['currency_conversion_rate'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'total_amount_invoice'      => format_amount($invoiceData['invoice_currency_total_amount'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'total_amount_company'      => format_amount($invoiceData['company_currency_total_amount'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'remaining_amount_invoice'  => format_amount($invoiceData['invoice_currency_total_amount'] - $invoiceData['invoice_currency_amount_received'], $invoiceData['invoice_currency_short_code'], $invoiceData['invoice_currency_locale']),
                'remaining_amount_company'  => format_amount($invoiceData['total_remaining_amount'], $invoiceData['company_currency_short_code'], $invoiceData['company_currency_locale']),
                'remaining_amount'          => (float) number_format((float)$invoiceData['total_remaining_amount'], 2, '.', ''),
                'invoice_status'            => $paymentStatus,
                'way_of_payment'            => $wayOfPayment,
                'filed_labels'              => $filedLabel
            ];
            $response['invoiceData'] = $data;
            $response['paymentData'] = $invoicePaymentData;
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }


    public function create()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();

        $validationRules = [
            'invoice_id'              => ["label" => "invoice",                 "rules" => "required"],
            'payment_date'            => ["label" => "payment date",            "rules" => "required"],
            'reference_no'            => ["label" => "reference no",            "rules" => "required"],
            'payment_source_id'       => ["label" => "payment source",          "rules" => "required"],
            'invoice_currency_amount' => ["label" => "invoice currency amount", "rules" => "required"],
            'company_currency_amount' => ["label" => "company currency amount", "rules" => "required"],
            'status'                  => ["label" => "status",                  "rules" => "required|in_list[Bad Debt, Due, Paid, Partial]"],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {
            // Calculate invoice is Loss or profit.
            $invoiceData = $this->invoice->find($request['invoice_id']);
            $totalInvoiceReceiveAmount = $invoiceData['invoice_currency_amount_received'];
            $totalCompanyReceiveAmount = $invoiceData['company_currency_amount_received'];
            $remainingAmount = $invoiceData['total_remaining_amount'];

            $getDifference = $remainingAmount - ($request['company_currency_amount'] + $request['tds']);

            // Invoice Payment Status 
            $paymentStatus = "Remaining";
            if ($request['status'] == "Paid" || $request['status'] == "Bad Debt") {
                if ($getDifference > 0) {
                    $paymentStatus = "Loss";
                } else if ($getDifference < 0) {
                    $paymentStatus = "Profit";
                } else if ($getDifference == 0) {
                    $paymentStatus = "Settled";
                }
            }

            $taxRatDetails = model(InvoiceTax::class)->select('SUM(tax_rate) as tax_rate ')->where('invoice_id', $request['invoice_id'])->groupBy('invoice_id')->get()->getRowArray();
            $taxRate = 1;
            if ($taxRatDetails) {
                $taxRate = $taxRatDetails['tax_rate'];
            }

            $amountTotal = $request['company_currency_amount'] + $request['tds'];
            $amountWithoutTax = $amountTotal - ($amountTotal *  $taxRate / 100);

            $newData = [
                'invoice_id'                => $request['invoice_id'],
                'payment_date'              => $request['payment_date'],
                'reference_no'              => $request['reference_no'],
                'payment_source_id'         => $request['payment_source_id'],
                'invoice_currency_amount'   => $request['invoice_currency_amount'],
                'company_currency_amount'   => $request['company_currency_amount'],
                'tds'                       => $request['tds'],
                'currency_conversion_rate'  => $request['currency_conversion_rate'],
                'difference_amount'         => $request['difference'],
                'amount_without_tax'        => $amountWithoutTax,
                'subscriber_ccr'            => $request['subscriber_ccr'],
                'USD_ccr'                   => $request['USD_ccr'],
                'payment_status'            => $paymentStatus,
                'status'                    => $request['status'],
                'note'                      => $request['note'],
                'created_by'                => $userData['id'],
                'created_at'                => Time::now()
            ];
            $this->invoicePayment->save($newData);

            if ($request['status'] != "Bad Debt") {
                $invoiceData = [
                    'invoice_currency_amount_received' => $totalInvoiceReceiveAmount + $request['invoice_currency_amount'],
                    'company_currency_amount_received' => $totalCompanyReceiveAmount + $request['company_currency_amount'] + $request['tds'],
                    'total_remaining_amount'           => $getDifference,
                    'total_difference'                 => $getDifference,
                    'invoice_status'                   => $request['status'],
                ];
            } else {
                $invoiceData = [
                    'invoice_status'    => $request['status'],
                ];
            }

            $this->invoice->update($request['invoice_id'], $invoiceData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_INVOICE_PAYMENT]);
    }

    public function update()
    {
        $request = $this->request->getPost();
        $userData = getTokenUser();

        // Validation
        $validationRules = [
            'invoice_id'              => ["label" => "invoice",        "rules" => "required"],
            'payment_date'            => ["label" => "payment date",   "rules" => "required"],
            'reference_no'            => ["label" => "reference no",   "rules" => "required"],
            'payment_source_id'       => ["label" => "payment source", "rules" => "required"],
            'invoice_currency_amount' => ["label" => "invoice currency amount", "rules" => "required"],
            'company_currency_amount' => ["label" => "company currency amount", "rules" => "required"],
            'status'                  => ["label" => "status",        "rules" => "required|in_list[Bad Debt, Due, Paid, Partial]"],
        ];

        if (!$this->validate($validationRules)) :
            $message = GET_VALIDATION_MSG($this->validator->getErrors());
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        endif;

        $this->db->transBegin();
        try {

            // Calculate invoice is Loss or profit.
            $invoiceData = $this->invoice->find($request['invoice_id']);
            $invoicePaymentData = $this->invoicePayment->find($request['id']);

            $totalInvoiceReceiveAmount = $invoiceData['invoice_currency_amount_received'] -  $invoicePaymentData['invoice_currency_amount'];
            $totalCompanyReceiveAmount = $invoiceData['company_currency_amount_received'] -  ($invoicePaymentData['company_currency_amount'] + $invoicePaymentData['tds']);
            $remainingAmount = $invoiceData['total_remaining_amount'] + ($invoicePaymentData['company_currency_amount'] + $invoicePaymentData['tds']);

            $getDifference = $remainingAmount - ($request['company_currency_amount'] + $request['tds']);

            // Invoice Payment Status 
            $paymentStatus = "Remaining";
            if ($request['status'] == "Paid" || $request['status'] == "Bad Debt") {
                if ($getDifference > 0) {
                    $paymentStatus = "Loss";
                } else if ($getDifference < 0) {
                    $paymentStatus = "Profit";
                } else if ($getDifference == 0) {
                    $paymentStatus = "Settled";
                }
            }

            $taxRatDetails = model(InvoiceTax::class)->select('SUM(tax_rate) as tax_rate ')->where('invoice_id', $request['invoice_id'])->groupBy('invoice_id')->get()->getRowArray();
            $taxRate = 1;
            if ($taxRatDetails) {
                $taxRate = $taxRatDetails['tax_rate'];
            }

            $amountTotal = $request['company_currency_amount'] + $request['tds'];
            $amountWithoutTax = $amountTotal - ($amountTotal *  $taxRate / 100);

            $newData = [
                'invoice_id'                => $request['invoice_id'],
                'payment_date'              => $request['payment_date'],
                'reference_no'              => $request['reference_no'],
                'payment_source_id'         => $request['payment_source_id'],
                'invoice_currency_amount'   => $request['invoice_currency_amount'],
                'company_currency_amount'   => $request['company_currency_amount'],
                'tds'                       => $request['tds'],
                'currency_conversion_rate'  => $request['currency_conversion_rate'],
                'difference_amount'         => $request['difference'],
                'amount_without_tax'        => $amountWithoutTax,
                'subscriber_ccr'            => $request['subscriber_ccr'],
                'USD_ccr'                   => $request['USD_ccr'],
                'payment_status'            => $paymentStatus,
                'status'                    => $request['status'],
                'note'                      => $request['note'],
                'created_by'                => $userData['id'],
                'created_at'                => Time::now()
            ];
            $this->invoicePayment->update($request['id'], $newData);

            if ($request['status'] != "Bad Debt") {
                $invoiceData = [
                    'invoice_currency_amount_received' => $totalInvoiceReceiveAmount + $request['invoice_currency_amount'],
                    'company_currency_amount_received' => $totalCompanyReceiveAmount + $request['company_currency_amount'] + $request['tds'],
                    'total_remaining_amount'           => $getDifference,
                    'total_difference'                 => $getDifference,
                    'invoice_status'                   => $request['status'],
                ];
            } else {
                $invoiceData = [
                    'invoice_status'    => $request['status'],
                ];
            }
            $this->invoice->update($request['invoice_id'], $invoiceData);
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_INVOICE_PAYMENT]);
    }


    /***************************************************
     *              Delete Invoice Payment
     * -------------------------------------------------
     ***************************************************/

    public function delete()
    {
        $request = $this->request->getPost();
        $invoicePaymentData = $this->invoicePayment->find($request['id']);
        if ($invoicePaymentData) {
            $invoicePaymentID = $request['id'];
            $invoiceID = $invoicePaymentData['invoice_id'];

            try {
                $this->db->transBegin();
                $invoiceData = $this->invoice->find($invoiceID);
                $latestInvoicePaymentData = $this->invoicePayment->where('invoice_id', $invoiceID)->orderBy('id', 'DESC')->limit(1, 1)->get()->getRowArray();

                $totalInvoiceReceiveAmount = $invoiceData['invoice_currency_amount_received'] -  $invoicePaymentData['invoice_currency_amount'];
                $totalCompanyReceiveAmount = $invoiceData['company_currency_amount_received'] -  ($invoicePaymentData['company_currency_amount'] + $invoicePaymentData['tds']);
                $remainingAmount = $invoiceData['total_remaining_amount'] + ($invoicePaymentData['company_currency_amount'] + $invoicePaymentData['tds']);
                $invoiceData = [
                    'invoice_currency_amount_received' => $totalInvoiceReceiveAmount,
                    'company_currency_amount_received' => $totalCompanyReceiveAmount,
                    'total_remaining_amount'           => $remainingAmount,
                    'total_difference'                 => $remainingAmount,
                    'invoice_status'                   => !empty($latestInvoicePaymentData) ? $latestInvoicePaymentData['status'] : 'Due',
                ];

                $this->invoice->update($invoiceID, $invoiceData);
                $this->invoicePayment->delete($invoicePaymentID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $err->getMessage()], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_INVOICE_PAYMENT]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => INVOICE_PAYMENT_NOT_FOUND], '404');
    }
}
