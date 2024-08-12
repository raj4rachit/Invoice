<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Entities\Collection;
use App\Models\Client;
use App\Models\Company;
use App\Models\CompanyBank;
use App\Models\CompanyClient;
use App\Models\CompanySetting;
use App\Models\CompanyUser;
use App\Models\CountryTax;
use App\Models\Currency;
use App\Models\DocumentType;
use App\Models\Invoice;
use App\Models\InvoiceAttachment;
use App\Models\InvoiceBank;
use App\Models\InvoiceItem;
use App\Models\InvoiceItemType;
use App\Models\InvoicePayment;
use App\Models\InvoiceTax;
use App\Models\PaymentTerm;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\I18n\Time;
use Exception;
use ZipArchive;

class InvoiceController extends BaseController
{
    use ResponseTrait;

    protected $client;
    protected $subscriber;
    protected $currency;
    protected $tax;
    protected $company;
    protected $itemType;
    protected $invoice;
    protected $invoiceItem;
    protected $invoiceTax;
    protected $paymentTerm;

    public function __construct()
    {
        $this->client       = new Client();
        $this->subscriber   = new Subscriber();
        $this->company      = new Company();
        $this->currency     = new Currency();
        $this->tax          = new CountryTax();
        $this->itemType     = new InvoiceItemType();
        $this->invoice      = new Invoice();
        $this->invoiceItem  = new InvoiceItem();
        $this->invoiceTax   = new InvoiceTax();
        $this->paymentTerm  = new PaymentTerm();
    }

    public function index()
    {
        $userSelection = getSelectedCompany();

        $request        = $this->request->getGet();
        $data           = $this->invoice->resource($request)->get()->getResultArray();

        $footerTotal    = [];
        if ($userSelection->company_id != "0") {
            $footerTotal = [
                'total' => 0,
                'received_amount' => 0,
            ];
        }

        $attachment = new InvoiceAttachment();
        $payment = new InvoicePayment();
        if (!empty($data)) {
            foreach ($data as $key => $result) {
                $companyCurrency = ((($result['subtotal'] - $result['total_discount']) + $result['total_tax_amount']) * $result['currency_conversion_rate']);
                if ($userSelection->company_id != "0") {
                    $footerTotal['total'] = (float) $footerTotal['total'] + (float) $companyCurrency;
                    $footerTotal['received_amount'] = (float) $footerTotal['received_amount'] + (float) $result['company_currency_amount_received'];
                }


                $paymentList = $payment->ByInvoiceID($result['id']);

                $listArray = [];
                if (!empty($paymentList)) {
                    foreach ($paymentList as $k => $value) :
                        $paymentAmount = format_amount($value['company_currency_amount'], $result['company_currency_short_code'], $result['company_currency_locale']);
                        $listArray[$k] = $value['payment_date'] . ' | ' . $paymentAmount . ' | ' . $value['payment_source_name'];
                    endforeach;
                }

                $data[$key]['payment_list'] = $listArray;


                $data[$key]['has_attachment'] = ($attachment->where('invoice_id', $result['id'])->countAllResults()) > 0 ? true : false;
                $data[$key]['attached_list'] = ($attachment->where('invoice_id', $result['id'])->findColumn('file_name')) ?? [];
                $data[$key]['subtotal'] = format_amount($result['subtotal'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                $data[$key]['total_discount'] = format_amount($result['total_discount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                $data[$key]['total_tax_amount'] = format_amount($result['total_tax_amount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                $data[$key]['company_currency_total_amount'] = format_amount($companyCurrency, $result['company_currency_short_code'], $result['company_currency_locale']);
                $data[$key]['invoice_currency_total_amount'] = format_amount($result['invoice_currency_total_amount'], $result['invoice_currency_short_code'], $result['invoice_currency_locale']);
                $data[$key]['company_currency_amount_received'] = format_amount($result['company_currency_amount_received'], $result['company_currency_short_code'], $result['company_currency_locale']);
                $data[$key]['currency_conversion_rate'] = format_amount($result['currency_conversion_rate'], $result['company_currency_short_code'], $result['company_currency_locale'], 6);
                $data[$key]['is_discount'] = $result['total_discount'] > 0 ? true : false;
                $data[$key]['has_payment'] = ($payment->where('invoice_id', $result['id'])->countAllResults()) > 0 ? true : false;
            }
        }
        if ($userSelection->company_id != "0") {
            $currency = model(Company::class)->getCurrency($userSelection->company_id);
            $footerTotal['total'] = format_amount($footerTotal['total'], $currency['short_code'], $currency['locale']);
            $footerTotal['received_amount'] = format_amount($footerTotal['received_amount'], $currency['short_code'], $currency['locale']);
        }

        $response = Collection::tableData(
            $data,
            $this->invoice->resource($request, false)->countAllResults()
        );
        $response['widgets']    = $this->invoice->getWidgetsData($request);
        $response['footerTotal'] = $footerTotal;

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function generateInvoiceNumber($userSelection)
    {
        $companyID = $userSelection->company_id;

        $startYearTwoDigit = date('y', strtotime($userSelection->start_date));
        $endYearTwoDigit = date('y', strtotime($userSelection->end_date));
        $invoiceYearRange = ($startYearTwoDigit == $endYearTwoDigit) ? date('Y', strtotime($userSelection->start_date)) : $startYearTwoDigit . $endYearTwoDigit;

        $invoice = $this->invoice->select('invoice_no')->where('company_id', $companyID)->orderBy('id', 'DESC')->first();

        $companySetting = model(CompanySetting::class)->getSelectedCompanySetting($companyID);
        if (!$companySetting) :
            return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => COMPANY_SETTING_NOT_FOUND]);
        endif;

        $invoiceNo = null;
        if ($invoice === null) {
            $invoiceNo = str_pad('0001', 4, "0", STR_PAD_LEFT);
        } else {
            $latestInvoiceNo = $invoice['invoice_no'];
            $oldInvoiceNo = explode("/", $latestInvoiceNo);
            $oldNoDate = $oldInvoiceNo[2];

            if (strtotime($oldNoDate) == strtotime(date($companySetting->invoice_prefix_date_format))) {
                $incrementedNo = end($oldInvoiceNo) + 1;
                $invoiceNo = str_pad((string) $incrementedNo, 4, "0", STR_PAD_LEFT);
            } else {
                $invoiceNo = str_pad('0001', 4, "0", STR_PAD_LEFT);
            }
        }

        $dateFormate = strtoupper(date($companySetting->invoice_prefix_date_format));
        $companyCode = $companySetting->company_code !== '' ? $companySetting->company_code . '/' : '';

        $invoiceNo = $companyCode . $invoiceYearRange . "/" . $dateFormate . "/" . $invoiceNo;

        return $invoiceNo;
    }

    public function view()
    {
        global $discountType;
        global $paymentStatus;
        $userData = getTokenUser();
        $request = $this->request->getPost();

        $currencyList   = $this->currency->select('id,currency_name,currency_symbol,short_code')->where('status', 'Active')->orderBy('currency_name')->get()->getResultArray();
        $itemTypeList   = $this->itemType->where('subscriber_id', $userData['subscriber_id'])->where('status', 'Active')->get()->getResultArray();

        if (isset($request['type']) && ($request['type'] === 'edit' || $request['type'] === 'view') && (isset($request['id']) && $request['id'] != '')) {

            $invoice = $this->invoice->select('invoices.*, subscribers.currency_id as subscriber_currency_id,
                      company_currency.locale as company_currency_locale,
                      company_currency.short_code as company_currency_short_code,
                      invoice_currency.locale as invoice_currency_locale,
                      invoice_currency.short_code as invoice_currency_short_code,')
                ->where('invoices.id', $request['id'])
                ->join('subscribers', 'subscribers.id = invoices.subscriber_id', 'LEFT')
                ->join('currencies as company_currency', 'company_currency.id = invoices.company_currency_id', 'LEFT')
                ->join('currencies as invoice_currency', 'invoice_currency.id = invoices.invoice_currency_id', 'LEFT')
                ->get()->getRow();

            $companyID = $invoice->company_id;

            // Client List
            $clientList = $this->client->getUserClientsByInvoiceYear('id,client_name,company_name,is_bifurcated', [$companyID]);
            $bifurcatedClient = $this->client->getUserBifurcatedClients('id,client_name,company_name,is_bifurcated', [$companyID]);

            $companyDetail = $this->db->table('companies')->select('*')->where('id', $companyID)->get()->getRow();
            $taxList        = $companyDetail ?  $this->tax->select('id,tax_name,rate,is_percentage')->where('country_id', $companyDetail->country_id)->where('status', 'Active')->get()->getResultArray() : [];
            $bankList       = model(CompanyBank::class)->where('company_id', $companyID)->orderBy('bank_detail_name')->findAll();
            $paymentTerms   = $this->paymentTerm->select('id,title')->where('company_id', $companyID)->where('status', 'Active')->get()->getResultArray();

            $invoiceCompanyDetails = $this->company->select('companies.*, countries.country_name, CONCAT("' . base_url() . '/company_logo/",company_settings.company_logo) as company_logo')
                ->where('companies.id', $invoice->company_id)
                ->join('company_settings', 'company_settings.company_id = companies.id')
                ->join('countries', 'countries.id = companies.country_id')
                ->get()->getRow();

            $client = $this->client->select('clients.id, clients.client_name,
                                            clients.company_name, clients.tax_no,
                                            clients.gst_vat_no,clients.email,
                                            clients.phone,clients.address_1,
                                            clients.address_2,clients.city,
                                            clients.state,clients.zip_code,
                                            countries.country_name')
                ->join('countries', 'countries.id = clients.country_id')
                ->where('clients.id', $invoice->client_id)
                ->get()->getRow();

            $invoiceItems = $this->invoiceItem->where('invoice_id', $request['id'])->get()->getResultArray();

            $invoiceTaxes = $this->invoiceTax->select('invoice_taxes.*,country_taxes.tax_name')
                ->where('invoice_taxes.invoice_id', $request['id'])
                ->join('country_taxes', 'invoice_taxes.tax_id = country_taxes.id')
                ->get()->getResultArray();

            $invoiceBanks = model(InvoiceBank::class)->where('invoice_id', $request['id'])->findAll();

            if ($request['type'] == "edit") {
                $response = [
                    'invoice'                => $invoice,
                    'invoiceItems'          => $invoiceItems,
                    'invoiceTaxes'          => $invoiceTaxes,
                    'invoiceBanks'          => $invoiceBanks,
                    'clientList'            => $clientList,
                    'currencyList'          => $currencyList,
                    'bifurcatedClientList'  => $bifurcatedClient,
                    'taxList'               => $taxList,
                    'bankList'              => $bankList,
                    'invoiceItemTypeList'   => $itemTypeList,
                    'discountType'          => $discountType,
                    'paymentTerms'          => $paymentTerms
                ];
            }

            if ($request['type'] == "view") {
                // Invoice Currency
                $invoice->total_discount_flag = $invoice->total_discount > 0 ? true : false;
                $invoice->total_deduction_flag = $invoice->total_deduction > 0 ? true : false;
                $invoice->subtotal = format_amount($invoice->subtotal, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                $invoice->total_discount = format_amount($invoice->total_discount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                $invoice->total_deduction = format_amount($invoice->total_deduction, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                $invoice->total_tax_amount = format_amount($invoice->total_tax_amount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                $invoice->invoice_currency_total_amount = format_amount($invoice->invoice_currency_total_amount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                $invoice->invoice_currency_amount_received = format_amount($invoice->invoice_currency_amount_received, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);

                // Company Currency
                $invoice->company_currency_amount_received = format_amount($invoice->company_currency_amount_received, $invoice->company_currency_short_code, $invoice->company_currency_locale);
                $invoice->company_currency_total_amount = format_amount($invoice->company_currency_total_amount, $invoice->company_currency_short_code, $invoice->company_currency_locale);
                $invoice->currency_conversion_rate = format_amount($invoice->currency_conversion_rate, $invoice->company_currency_short_code, $invoice->company_currency_locale);

                foreach ($invoiceItems as $key => $result) {
                    $itemTaxAmount = [];
                    $subTotal = $result['subtotal'];

                    foreach ($invoiceTaxes as $keys => $taxes) {
                        // $taxAmount = ($invoiceItems[$keys]['subtotal'] * $taxes['tax_rate']) / 100;
                        $itemTaxAmount[$keys]['tax_name'] = $taxes['tax_name'];
                        $itemTaxAmount[$keys]['tax_amount'] = format_amount((($subTotal * $taxes['tax_rate']) / 100), $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    }

                    $invoiceItems[$key]['itemTaxAmount'] = $itemTaxAmount;
                    $invoiceItems[$key]['rate'] = format_amount($result['rate'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    $invoiceItems[$key]['deduction'] = format_amount($result['deduction'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    $invoiceItems[$key]['tax_amount'] = format_amount($result['tax_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    $invoiceItems[$key]['discount_amount'] = format_amount($result['discount_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    $invoiceItems[$key]['subtotal'] = format_amount($result['subtotal'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                    $invoiceItems[$key]['total_amount'] = format_amount($result['total_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                }

                foreach ($invoiceTaxes as $key => $result) {
                    $invoiceTaxes[$key]['tax_amount'] = format_amount($result['tax_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
                }

                $documentType = model(DocumentType::class)->where('subscriber_id', $invoice->subscriber_id)->orderBy('name')->findAll();
                $invoiceBanks = model(InvoiceBank::class)->invoiceBanks($request['id']);
                $invoiceTerm = $invoice->term_id != '' ?
                    $this->paymentTerm->find($invoice->term_id) : null;

                $response = [
                    'invoice'               => $invoice,
                    'invoiceItems'          => $invoiceItems,
                    'invoiceTaxes'          => $invoiceTaxes,
                    'invoiceBanks'          => $invoiceBanks,
                    'invoiceTerm'           => $invoiceTerm,
                    'client'                => $client,
                    'invoiceCompanyDetails' => $invoiceCompanyDetails,
                    'documentType'          => $documentType,
                ];
            }
        } elseif (isset($request['type']) && $request['type'] === 'add') {
            $userSelection = getSelectedCompany();
            $userData = getTokenUser();

            // $invoice = $this->invoice->select('invoice_no')->where('company_id', $userSelection->company_id)->orderBy('id', 'DESC')->limit(1)->get()->getRow();
            $clientList = $this->client->getUserClientsByInvoiceYear('id,client_name,company_name,is_bifurcated', [$userSelection->company_id]);

            // $clientList[] = [
            //     "id" => "-",
            //     "client_name" => "------------------",
            //     "company_name" => "------------------",
            //     "is_bifurcated" => "No"
            // ];

            $bifurcatedClient = $this->client->getUserBifurcatedClients('id,client_name,company_name,is_bifurcated', [$userSelection->company_id]);
            $subscriberDetails = $this->subscriber->select('currency_id')->find($userData['subscriber_id']);
            $companyDetail = $this->db->table('companies')->select('*')->where('id', $userSelection->company_id)->get()->getRow();
            $taxList        = $companyDetail ?  $this->tax->select('id,tax_name,rate,is_percentage')->where('country_id', $companyDetail->country_id)->where('status', 'Active')->orderBy('tax_name')->get()->getResultArray() : [];
            $bankList       = model(CompanyBank::class)->where('company_id', $companyDetail->id)->orderBy('bank_detail_name')->findAll();
            $paymentTerms   = $this->paymentTerm->select('id,title')->where('company_id', $companyDetail->id)->where('status', 'Active')->orderBy('title')->get()->getResultArray();

            // Invoice Number
            // $invoiceNo =  $this->generateInvoiceNumber($userSelection);
            $invoiceNo =  model(CompanySetting::class)->generateInvoiceNumber($userSelection);

            $response = [
                'invoice_number'            => $invoiceNo,
                'subscriber_currency_id'    => $subscriberDetails['currency_id'],
                'clientList'                => $clientList,
                'currencyList'              => $currencyList,
                'bifurcatedClientList'      => $bifurcatedClient,
                'taxList'                   => $taxList,
                'bankList'                  => $bankList,
                'invoiceItemTypeList'       => $itemTypeList,
                'discountType'              => $discountType,
                'paymentTerms'              => $paymentTerms
            ];
        } else {
            $userSelection = getSelectedCompany();
            $companyID =  $userSelection->company_id != 0 ? [$userSelection->company_id] : [];

            $response = [
                'clientList'    => $this->client->getUserClientsByInvoiceYear('id,client_name,company_name', $companyID),
                'paymentStatus'    => $paymentStatus,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function currencyRate()
    {
        $request = $this->request->getGet();

        $userData = getTokenUser();
        $InvoiceCurrencyDetail = model(Currency::class)->find($request['currency_id']);
        $InvoiceCurrency = strtolower($InvoiceCurrencyDetail['short_code']);

        $CompanyCurrencyDetails = $this->company->getCurrency($request['company_id']);
        $companySortCode = strtolower($CompanyCurrencyDetails['short_code']);

        $SubscriberCurrencyDetails = $this->subscriber->getCurrency($userData['subscriber_id']);
        $SubscriberSortCode = strtolower($SubscriberCurrencyDetails['short_code']);

        $curl = service('curlrequest');
        // $CurrencyRate = $curl->get("https://api.exchangerate.host/latest?base=$InvoiceCurrency", [
        //     "headers" => [
        //         "Accept" => "application/json"
        //     ]
        // ]);
        $CurrencyRate = $curl->get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/$InvoiceCurrency.json");
        $body = (array) json_decode($CurrencyRate->getBody());
        $rates = (array) $body[$InvoiceCurrency];

        $response = [
            'company_ccr' => $rates[$companySortCode],
            'subscriber_ccr' => $rates[$SubscriberSortCode],
            'USD_ccr' => $rates['usd']
        ];

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function create()
    {
        $userData = getTokenUser();
        $userSelection = getSelectedCompany();
        $company = $this->company->where('id', $userSelection->company_id)->first();

        $request = $this->request->getPost();
        try {
            $this->db->transBegin();

            $newData = [
                'invoice_no'                            => $request['invoice_no'],
                'invoice_date'                          => $request['invoice_date'],
                'invoice_due_date'                      => $request['invoice_due_date'],
                'subscriber_id'                         => $userData['subscriber_id'],
                'company_id'                            => $userSelection->company_id,
                'client_id'                             => $request['client_id'],
                'company_financial_id'                  => $userSelection->year_id,
                'is_bifurcated'                         => $request['is_bifurcated'],
                'discount_type'                         => $request['discount_type'],
                'is_display_company_amount'             => $request['is_display_company_amount'],
                'invoice_currency_id'                   => $request['invoice_currency_id'],
                'company_currency_id'                   => $company['currency_id'],
                'total_tax_amount'                      => $request['total_tax_amount'],
                'total_discount'                        => $request['total_discount'],
                'total_deduction'                       => $request['total_deduction'],
                'subtotal'                              => $request['subtotal'],
                'invoice_currency_total_amount'         => $request['invoice_currency_total_amount'],
                'currency_conversion_rate'              => $request['currency_conversion_rate'],
                'company_currency_total_amount'         => $request['company_currency_total_amount'],
                'invoice_status'                        => "Due",
                'term_id'                               => $request['term_id'] != '' ? $request['term_id'] : Null,
                'total_remaining_amount'                => $request['company_currency_total_amount'],
                'subscriber_currency_id'                => $request['subscriber_currency_id'],
                'subscriber_currency_conversion_rate'   => $request['subscriber_currency_conversion_rate'],
                'subscriber_currency_total_amount'      => $request['subscriber_currency_total_amount'],
                'USD_currency_conversion_rate'          => $request['USD_currency_conversion_rate'],
                'USD_currency_total_amount'             => $request['USD_currency_total_amount'],
                'invoice_note'                          => $request['invoice_note'],
                'created_by'                            => $userData['id'],
                'created_at'                            => Time::now(),
            ];

            $this->invoice->insert($newData);
            $invoiceID = $this->invoice->getInsertID();
            $newItemData = [];
            if (isset($request['item'])) {
                foreach ($request['item'] as $key => $value) {
                    $newItemData[] = [
                        'invoice_id'        => $invoiceID,
                        'item_type_id'      => $value['item_type_id'],
                        'client_id'         => ($request['is_bifurcated']) == "No" ? $request['client_id'] : $value['client_id'],
                        'is_bifurcated'     => $request['is_bifurcated'],
                        'resource_name'     => $value['resource_name'],
                        'start_date'        => $value['start_date'],
                        'end_date'          => $value['end_date'],
                        'actual_days'       => $value['actual_day'],
                        'working_days'      => $value['working_day'],
                        'resource_quantity' => $value['resource_quantity'],
                        'rate'              => $value['rate'],
                        'deduction'         => $value['deduction'],
                        'tax_amount'        => $value['tax_amount'],
                        'discount'          => $value['discount'],
                        'discount_amount'   => $value['discount_amount'],
                        'subtotal'          => $value['subtotal'],
                        'total_amount'      => $value['total_amount'],
                        'description'       => $value['description'],
                        'created_at'        => Time::now(),
                    ];
                }
                $this->invoiceItem->insertBatch($newItemData);
            }

            $invoiceItemIDs = $this->invoiceItem->select('id')->where('invoice_id', $invoiceID)->get()->getResultArray();

            $ItemIDs = array();
            foreach ($invoiceItemIDs as $ID) {
                $ItemIDs[]  = $ID['id'];
            }

            $newTaxData = [];
            if (isset($request['tax'])) {
                foreach ($request['tax'] as $value) {
                    $newTaxData[] = [
                        'invoice_id'        => $invoiceID,
                        'tax_id'            => $value['tax_id'],
                        'invoice_item_id'   => implode(",", $ItemIDs),
                        'tax_rate'          => $value['tax_rate'],
                        'is_percentage'     => $value['is_percentage'],
                        'tax_amount'        => ($value['is_percentage'] == "Yes") ? ($request['subtotal'] * $value['tax_rate']) / 100 : $value['tax_rate'],
                        'created_at'        =>  Time::now(),
                    ];
                }
                $this->invoiceTax->insertBatch($newTaxData);
            }

            if (isset($request['bank'])) {
                $banks = [];
                foreach ($request['bank'] as $bank) {
                    $banks[] = [
                        'invoice_id' => $invoiceID,
                        'company_bank_id' => $bank,
                        'created_at'    => Time::now()
                    ];
                }
                $invoiceBank = new InvoiceBank();
                $invoiceBank->insertBatch($banks);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_INVOICE]);
    }

    public function update()
    {
        $userData = getTokenUser();
        $request = $this->request->getPost();
        try {
            $this->db->transBegin();
            $newData = [
                'invoice_no'                            => $request['invoice_no'],
                'invoice_date'                          => $request['invoice_date'],
                'invoice_due_date'                      => $request['invoice_due_date'],
                'subscriber_id'                         => $userData['subscriber_id'],
                'client_id'                             => $request['client_id'],
                'is_bifurcated'                         => $request['is_bifurcated'],
                'discount_type'                         => $request['discount_type'],
                'is_display_company_amount'             => $request['is_display_company_amount'],
                'invoice_currency_id'                   => $request['invoice_currency_id'],
                'total_tax_amount'                      => $request['total_tax_amount'],
                'total_discount'                        => $request['total_discount'],
                'total_deduction'                       => $request['total_deduction'],
                'subtotal'                              => $request['subtotal'],
                'invoice_currency_total_amount'         => $request['invoice_currency_total_amount'],
                'currency_conversion_rate'              => $request['currency_conversion_rate'],
                'company_currency_total_amount'         => $request['company_currency_total_amount'],
                'term_id'                               => $request['term_id'] != '' ? $request['term_id'] : Null,
                'total_remaining_amount'                => $request['company_currency_total_amount'],
                'subscriber_currency_id'                => $request['subscriber_currency_id'],
                'subscriber_currency_conversion_rate'   => $request['subscriber_currency_conversion_rate'],
                'subscriber_currency_total_amount'      => $request['subscriber_currency_total_amount'],
                'USD_currency_conversion_rate'          => $request['USD_currency_conversion_rate'],
                'USD_currency_total_amount'             => $request['USD_currency_total_amount'],
                'invoice_note'                          => $request['invoice_note'],
                'updated_by'                            => $userData['id'],
                'updated_at'                            => Time::now(),
            ];

            $this->invoice->update($request['id'], $newData);
            $this->invoiceItem->where('invoice_id', $request['id'])->delete();
            $this->invoiceTax->where('invoice_id', $request['id'])->delete();
            $invoiceID = $request['id'];
            $newItemData = [];

            if (isset($request['item'])) {
                foreach ($request['item'] as $key => $value) {
                    $newItemData[] = [
                        'invoice_id'        => $invoiceID,
                        'item_type_id'      => $value['item_type_id'],
                        'client_id'         => ($request['is_bifurcated']) == "No" ? $request['client_id'] : $value['client_id'],
                        'is_bifurcated'     => $request['is_bifurcated'],
                        'resource_name'     => $value['resource_name'],
                        'start_date'        => $value['start_date'],
                        'end_date'          => $value['end_date'],
                        'actual_days'       => $value['actual_day'],
                        'working_days'      => $value['working_day'],
                        'resource_quantity' => $value['resource_quantity'],
                        'rate'              => $value['rate'],
                        'deduction'         => $value['deduction'],
                        'tax_amount'        => $value['tax_amount'],
                        'discount'          => $value['discount'],
                        'discount_amount'   => $value['discount_amount'],
                        'subtotal'          => $value['subtotal'],
                        'total_amount'      => $value['total_amount'],
                        'description'       => $value['description'],
                        'created_at'        => Time::now(),
                    ];
                }

                $this->invoiceItem->insertBatch($newItemData);
            }

            $invoiceItemIDs = $this->invoiceItem->select('id')->where('invoice_id', $invoiceID)->get()->getResultArray();

            $ItemIDs = array();
            foreach ($invoiceItemIDs as $ID) {
                $ItemIDs[]  = $ID['id'];
            }
            $newTaxData = [];
            if (isset($request['tax'])) {
                foreach ($request['tax'] as $value) {
                    $newTaxData[] = [
                        'invoice_id'        => $invoiceID,
                        'tax_id'            => $value['tax_id'],
                        'invoice_item_id'   => implode(",", $ItemIDs),
                        'tax_rate'          => $value['tax_rate'],
                        'is_percentage'     => $value['is_percentage'],
                        'tax_amount'        => ($value['is_percentage'] == "Yes") ? ($request['subtotal'] * $value['tax_rate']) / 100 : $value['tax_rate'],
                        'created_at'        =>  Time::now(),
                    ];
                }
                $this->invoiceTax->insertBatch($newTaxData);
            }

            $banks = [];
            $invoiceBank = new InvoiceBank();
            $invoiceBank->where('invoice_id', $invoiceID)->delete();
            if (isset($request['bank'])) {
                foreach ($request['bank'] as $bank) {
                    $banks[] = [
                        'invoice_id' => $invoiceID,
                        'company_bank_id' => $bank,
                        'updated_at'    => Time::now()
                    ];
                }
                $invoiceBank->insertBatch($banks);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => UPDATE_INVOICE]);
    }

    public function delete()
    {
        $request = $this->request->getPost();
        $invoiceData = $this->invoice->getResource($request, false, true);

        if ($invoiceData) {
            $InvoiceID = $request['id'];
            try {
                $this->db->transBegin();

                $attachment = new InvoiceAttachment();
                $attachmentData = $attachment->where('invoice_id', $InvoiceID)->get()->getResultArray();

                if (!empty($attachmentData)) {
                    foreach ($attachmentData as $pdfFile) {
                        if (file_exists(FCPATH . '/invoice_attachments/' . $pdfFile['document'])) {
                            unlink(FCPATH . '/invoice_attachments/' . $pdfFile['document']);
                        }
                    }
                }

                $this->invoice->delete($InvoiceID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_INVOICE]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => INVOICE_NOT_FOUND], '404');
    }

    public function addAttachment()
    {
        $userData = getTokenUser();
        $documentType = model(DocumentType::class)->where('subscriber_id', $userData['subscriber_id'])->orderBy('name')->findAll();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $documentType]);
    }

    public function attachmentList()
    {
        $request = $this->request->getGet();
        $attachment = new InvoiceAttachment();
        // $attachments = $attachment->select('id,file_name,document,CONCAT("' . base_url() . '/invoice_attachments/",document) as document_link')->where('invoice_id', $request['invoice_id'])->get()->getResultArray();
        $attachments = $attachment->byInvoiceID($request['invoice_id']);

        foreach ($attachments as $key => $attachment) {
            $image_type = pathinfo($attachment['document_link'], PATHINFO_EXTENSION);
            $getFile = file_get_contents($attachment['document_link']);
            $image_type =  mime_content_type(FCPATH . "/invoice_attachments/" . $attachment['document']);
            $attachments[$key]['base64_document'] = 'data:' . $image_type . ';base64,' . base64_encode($getFile);
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $attachments]);
    }

    public function attachmentCreate()
    {
        $request = $this->request->getPost();
        $requestFiles = $this->request->getFiles();
        // $validationRules      = [
        //     'invoice_id'     => ['label' => 'file name', 'rules' => 'required'],
        //     'file_name'     => ['label' => 'file name', 'rules' => 'required|is_uniques[invoice_attachments.file_name,[invoice_id.' . $request['invoice_id'] . ']]'],
        //     'document'   => ['label' => 'document', 'rules' => 'uploaded[document]|ext_in[document,png,jpg,jpeg,docx,docs,txt,pdf,xls,xlsx,webp]'],
        // ];
        // $validationMessages = [
        //     'file_name' => [
        //         'is_uniques' => 'The file name field must contain a unique value.'
        //     ],
        // ];
        // if (!$this->validate($validationRules, $validationMessages)) :
        //     $message = GET_VALIDATION_MSG($this->validator->getErrors());
        //     return $this->respond(['status' => VALIDATION_ST, 'status_code' => 200, 'message' => $message]);
        // endif;

        $this->db->transBegin();
        try {
            $attachment = new InvoiceAttachment();
            foreach ($request['files'] as $key => $value) :
                $file = $requestFiles['files'][$key]['document'];
                $newName = $file->getRandomName();
                $newData = [
                    'invoice_id'        => $request['invoice_id'],
                    'file_name'         => $value['file_name'],
                    'document_type_id'  => $value['doc_type'],
                    'document'          => $newName,
                    'created_at'        => Time::now()
                ];
                $attachment->save($newData);
                $file->move(FCPATH . '/invoice_attachments/', $newName);
            endforeach;


            // $img = $this->request->getFile('document');

            // $newData = [
            //     'invoice_id'  => $request['invoice_id'],
            //     'file_name'   => $request['file_name'],
            //     'document_type_id'    => $request['doc_type'],
            //     'document'    => $newName,
            //     'created_at'  => Time::now()
            // ];
        } catch (\Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . " " . $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_ATTACHMENT]);
    }

    public function attachmentDelete()
    {
        $request = $this->request->getPost();
        $attachment = new InvoiceAttachment();
        $attachmentData = $attachment->where('id', $request['id'])->get()->getRow();
        if ($attachmentData) {
            $attachmentID = $request['id'];
            try {
                $this->db->transBegin();
                if (file_exists(FCPATH . '/invoice_attachments/' . $attachmentData->document)) {
                    unlink(FCPATH . '/invoice_attachments/' . $attachmentData->document);
                }

                $attachment->delete($attachmentID);
            } catch (\Exception $err) {
                $this->db->transRollback();
                return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => SOMETHING_WRONG . $err->getMessage()], '400');
            }
            $this->db->transCommit();
            return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => DELETE_ATTACHMENT]);
        }
        return $this->respond(['status' => ERROR_ST, 'status_code' => 200, 'message' => ATTACHMENT_NOT_FOUND], '404');
    }

    public function downloadAttachmentList()
    {
        $request = $this->request->getGet();
        $attachment = new InvoiceAttachment();
        $attachments = $attachment->select('id,file_name,document')->where('invoice_id', $request['invoice_id'])->get()->getResultArray();

        $invoice = $this->invoice->select('invoices.invoice_no,clients.company_name')
            ->join('clients', 'clients.id = invoices.client_id')
            ->where('invoices.id', $request['invoice_id'])->get()->getRow();

        // $invoice_no = explode("/", $invoice->invoice_no);
        $invoice_no =  str_replace("/", "_", $invoice->invoice_no);
        $company_name = str_replace("/", "_", str_replace(".", "", str_replace(" ", "_", $invoice->company_name)));
        // $zipName = $invoice_no[1] . "_" . date("m", strtotime($invoice_no[2])) . "_" . $invoice_no[0] . "_" . $company_name . "_" . $invoice_no[1] . "_" . date("M", strtotime($invoice_no[2])) . "_" . $invoice_no[3] . ".zip";
        $zipName = $invoice_no . "_" . $company_name . ".zip";

        if (!file_exists('tempzip')) {
            mkdir('tempzip');
        }

        $zip = new ZipArchive();
        $fileName = "tempzip/" . $zipName;

        $zip->open($fileName, ZipArchive::CREATE);
        foreach ($attachments as $attachment) {
            $zip->addFile(FCPATH . '/invoice_attachments/' . $attachment['document'], $attachment['document']);
        }
        $zip->close();


        $getFile = file_get_contents(FCPATH . "/" . $fileName);
        $filedata = 'data:application/zip;base64,' . base64_encode($getFile);
        if (file_exists(FCPATH . '/' . $fileName)) {
            unlink(FCPATH . '/' . $fileName);
        }

        $data = [
            "file_name" => $zipName,
            "zip" => $filedata
        ];
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $data]);
    }

    public function pdfView($data)
    {
        return view('invoices/invoice', $data);
    }

    public function downloadInvoicePDF()
    {
        $request = $this->request->getPost();
        $invoice = $this->invoice->select('invoices.*, 
                company_currency.locale as company_currency_locale,
                company_currency.short_code as company_currency_short_code,
                invoice_currency.locale as invoice_currency_locale,
                invoice_currency.short_code as invoice_currency_short_code,')
            ->where('invoices.id', $request['id'])
            ->join('currencies as company_currency', 'company_currency.id = invoices.company_currency_id')
            ->join('currencies as invoice_currency', 'invoice_currency.id = invoices.invoice_currency_id')
            ->get()->getRow();

        $companyID = $invoice->company_id;
        // Client List
        $clientList = $this->client->getUserClients('id,client_name,company_name,is_bifurcated', [$companyID]);

        $bifurcatedClient = array_filter($clientList, function ($client) {
            if ($client['is_bifurcated'] == "Yes") {
                return $client;
            }
        });


        $companyDetail = $this->db->table('companies')->select('*')->where('id', $companyID)->get()->getRow();
        $taxList        = $companyDetail ?  $this->tax->select('id,tax_name,rate,is_percentage')->where('country_id', $companyDetail->country_id)->where('status', 'Active')->get()->getResultArray() : [];
        $paymentTerms   = $this->paymentTerm->select('id,title')->where('company_id', $companyID)->where('status', 'Active')->get()->getResultArray();
        $ipt = FCPATH . 'company_logo/';
        $invoiceCompanyDetails = $this->company
            ->select('companies.*, countries.country_name')
            ->select('companies.*, countries.country_name, company_settings.company_logo as company_logo')
            ->where('companies.id', $invoice->company_id)
            ->join('company_settings', 'company_settings.company_id = companies.id')
            ->join('countries', 'countries.id = companies.country_id')
            ->get()->getRow();
        $invoiceCompanyDetails->company_logo = $ipt . $invoiceCompanyDetails->company_logo;

        $client = $this->client->select('clients.id, clients.client_name,
                           clients.company_name, clients.tax_no,
                           clients.gst_vat_no,clients.email,
                           clients.phone,clients.address_1,
                           clients.address_2,clients.city,
                           clients.state,clients.zip_code,
                           countries.country_name')
            ->join('countries', 'countries.id = clients.country_id')
            ->where('clients.id', $invoice->client_id)
            ->get()->getRow();

        $invoiceItems = $this->invoiceItem->where('invoice_id', $request['id'])->get()->getResultArray();

        $invoiceTaxes = $this->invoiceTax->select('invoice_taxes.*,country_taxes.tax_name')
            ->where('invoice_taxes.invoice_id', $request['id'])
            ->join('country_taxes', 'invoice_taxes.tax_id = country_taxes.id')
            ->get()->getResultArray();
        $invoice->total_discount_flag = $invoice->total_discount > 0 ? true : false;
        $invoice->total_deduction_flag = $invoice->total_deduction > 0 ? true : false;
        $invoice->subtotal = format_amount($invoice->subtotal, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        $invoice->total_discount = format_amount($invoice->total_discount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        $invoice->total_deduction = format_amount($invoice->total_deduction, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        $invoice->total_tax_amount = format_amount($invoice->total_tax_amount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        $invoice->invoice_currency_total_amount = format_amount($invoice->invoice_currency_total_amount, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        $invoice->invoice_currency_amount_received = format_amount($invoice->invoice_currency_amount_received, $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);

        // Company Currency
        $invoice->company_currency_amount_received = format_amount($invoice->company_currency_amount_received, $invoice->company_currency_short_code, $invoice->company_currency_locale);
        $invoice->company_currency_total_amount = format_amount($invoice->company_currency_total_amount, $invoice->company_currency_short_code, $invoice->company_currency_locale);
        $invoice->currency_conversion_rate = format_amount($invoice->currency_conversion_rate, $invoice->company_currency_short_code, $invoice->company_currency_locale);

        foreach ($invoiceItems as $key => $result) {
            $itemTaxAmount = [];
            $subTotal = $result['subtotal'];

            foreach ($invoiceTaxes as $keys => $taxes) {
                // $taxAmount = ($invoiceItems[$keys]['subtotal'] * $taxes['tax_rate']) / 100;
                $itemTaxAmount[$keys]['tax_name'] = $taxes['tax_name'];
                $itemTaxAmount[$keys]['tax_amount'] = format_amount((($subTotal * $taxes['tax_rate']) / 100), $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            }

            $invoiceItems[$key]['itemTaxAmount'] = $itemTaxAmount;
            $invoiceItems[$key]['rate'] = format_amount($result['rate'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            $invoiceItems[$key]['deduction'] = format_amount($result['deduction'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            $invoiceItems[$key]['tax_amount'] = format_amount($result['tax_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            $invoiceItems[$key]['discount_amount'] = format_amount($result['discount_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            $invoiceItems[$key]['subtotal'] = format_amount($result['subtotal'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
            $invoiceItems[$key]['total_amount'] = format_amount($result['total_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        }

        foreach ($invoiceTaxes as $key => $result) {
            $invoiceTaxes[$key]['tax_amount'] = format_amount($result['tax_amount'], $invoice->invoice_currency_short_code, $invoice->invoice_currency_locale);
        }

        $invoiceTerm = $invoice->term_id != '' ?
            $this->paymentTerm->find($invoice->term_id) : null;

        $banks = model(InvoiceBank::class)->invoiceBanks($request['id']);

        $response = [
            'invoice'               => $invoice,
            'invoiceItems'          => $invoiceItems,
            'invoiceTaxes'          => $invoiceTaxes,
            'client'                => $client,
            'invoiceCompanyDetails' => $invoiceCompanyDetails,
            'invoiceTerm'           => $invoiceTerm,
            'banks'                 => $banks
        ];

        // Invoice Name
        // $invoiceNoPartition = explode("/", $invoice->invoice_no);
        $client_company_name = strtoupper(str_replace(" ", '_', str_replace('.', '', trim($client->company_name))));
        // $invoiceName = $invoiceNoPartition[1] . "_" . date('m', strtotime($invoiceNoPartition[2])) . "_" . $company_name . "_" . $invoiceNoPartition[1] . "_" . date('M', strtotime($invoiceNoPartition[2])) . "_" . $invoiceNoPartition[3] . ".pdf";
        $invoiceNoPartition = str_replace('/', '_', $invoice->invoice_no);
        $company_name = strtoupper(str_replace(" ", '_', str_replace('.', '', trim($invoiceCompanyDetails->company_name))));
        $invoiceName = $invoiceNoPartition . '_' . $client_company_name . '_' . $company_name;

        // $mpdf = new \Mpdf\Mpdf();
        $mpdf = new \Mpdf\Mpdf(['mode' => 'utf-8', 'format' => 'A4', 'margin_left' => 5, 'margin_top' => 5, 'margin_right' => 5, 'margin_bottom' => 1, 'orientation' => 'P']);
        $mpdf->showImageErrors = true;
        $mpdf->WriteHTML(view('invoices/invoice', $response));
        $this->response->setHeader('Content-Type', 'application/pdf');

        $tempName = uniqid() . ".pdf";
        $testing = $mpdf->Output('tempzip/' . $tempName, \Mpdf\Output\Destination::FILE);
        $filepath = FCPATH . '/tempzip/' . $tempName;

        $getFile = file_get_contents($filepath);
        $data = 'data:application/pdf;base64,' . base64_encode($getFile);

        if (file_exists($filepath)) {
            @unlink($filepath);
        }
        $response = [
            'invoice_name' => $invoiceName,
            'invoice' => $data,
        ];
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }


    /**********************************************
     *          Create Duplicate invoice
     *---------------------------------------------
     * this function create duplicate invoice by
     * invoice id, generate dynamic invoice number
     */

    public function duplicateInvoice()
    {
        $userSelection = getSelectedCompany();
        $request = $this->request->getGet();
        $invoiceID = $request['id'];

        # Get Invoice Data
        $invoice = $this->invoice->find($invoiceID);
        $invoiceItems = $this->invoiceItem->where('invoice_id', $invoiceID)->findAll();
        $invoiceTaxes = $this->invoiceTax->where('invoice_id', $invoiceID)->findAll();
        $invoiceBanks = model(InvoiceBank::class)->where('invoice_id', $invoiceID)->findAll();

        # Create Object for Invoice Number
        $newObject = (object) [
            'company_id' => $invoice['company_id'],
            'start_date' => $userSelection->start_date,
            'end_date' => $userSelection->end_date,
        ];
        // $invoiceNo = $this->generateInvoiceNumber($newObject);
        $invoiceNo =  model(CompanySetting::class)->generateInvoiceNumber($newObject);
        try {
            $this->db->transBegin();

            unset($invoice['id']);
            unset($invoice['updated_at']);
            unset($invoice['updated_by']);
            $newInvoiceData = $invoice;
            $newInvoiceData['invoice_no'] = $invoiceNo;
            $newInvoiceData['invoice_date'] = date('Y-m-d');
            $newInvoiceData['invoice_currency_amount_received'] = 0.00;
            $newInvoiceData['company_currency_amount_received'] = 0.00;
            $newInvoiceData['total_remaining_amount'] = $invoice['company_currency_total_amount'];
            $newInvoiceData['total_difference'] = 0.00;
            $newInvoiceData['invoice_status'] = 'Due';
            $newInvoiceData['created_at'] = Time::now();


            $this->invoice->insert($newInvoiceData);
            $insertedID = $this->invoice->getInsertID();



            if (!empty($invoiceItems)) {
                $newItemData = [];
                foreach ($invoiceItems as $key => $value) :
                    unset($value['id']);
                    unset($value['updated_at']);
                    $newItemData[$key] = $value;
                    $newItemData[$key]['invoice_id'] = $insertedID;
                    $newItemData[$key]['created_at'] = Time::now();
                endforeach;
                $this->invoiceItem->insertBatch($newItemData);
            }

            if (!empty($invoiceTaxes)) {
                $newTaxData = [];
                $invoiceItemIDs = $this->invoiceItem->select('id')->where('invoice_id', $insertedID)->findAll();
                $ItemIDs = array();
                foreach ($invoiceItemIDs as $ID) {
                    $ItemIDs[]  = $ID['id'];
                }


                foreach ($invoiceTaxes as $key => $value) :
                    unset($value['id']);
                    unset($value['updated_at']);
                    $newTaxData[$key] = $value;
                    $newTaxData[$key]['invoice_id'] = $insertedID;
                    $newTaxData[$key]['invoice_item_id'] = implode(",", $ItemIDs);
                    $newInvoiceData[$key]['created_at'] = Time::now();
                endforeach;
                $this->invoiceTax->insertBatch($newTaxData);
            }

            if (!empty($invoiceBanks)) {
                $banks = [];
                foreach ($invoiceBanks as $key => $bank) {
                    unset($value['id']);
                    $banks[$key] = $bank;
                    $banks[$key]['invoice_id'] = $insertedID;
                    $banks[$key]['created_at'] = Time::now();
                }
                $invoiceBank = new InvoiceBank();
                $invoiceBank->insertBatch($banks);
            }
        } catch (Exception $ex) {
            $this->db->transRollback();
            return $this->respond(['status' => ERROR_ST, 'status_code' => 400, 'message' => $ex->getMessage()], '400');
        }
        $this->db->transCommit();
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'message' => ADD_INVOICE]);
    }
}
