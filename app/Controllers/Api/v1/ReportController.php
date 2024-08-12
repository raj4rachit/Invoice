<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Client;
use App\Models\Company;
use App\Models\CompanyFinancialYear;
use App\Models\Currency;
use App\Models\Expenses;
use App\Models\Income;
use App\Models\Invoice;
use App\Models\InvoicePayment;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ReportController extends BaseController
{
    use ResponseTrait;
    protected $company;
    protected $invoice;
    protected $incomes;
    protected $expenses;
    protected $invoicePayment;
    protected $CompanyFinancialYear;

    public function __construct()
    {
        $this->company = new Company();
        $this->invoice = new Invoice();
        $this->expenses = new Expenses();
        $this->incomes = new Income();
        $this->invoicePayment = new InvoicePayment();
        $this->CompanyFinancialYear = new CompanyFinancialYear();
    }

    public function index()
    {
        $loginUser  = getTokenUser();
        $response['companyList'] = $this->company->getCompaniesByUser($loginUser);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function profitLossReport()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();
        $newRequest = array_merge($request, $loginUser);

        $CompanyID = $request['company_id'];
        $StartDate = $request['start_date'];
        $EndDate = $request['end_date'];

        $companyDetails =  $CompanyID > 0 ? $this->company->withCurrency($CompanyID) : [];
        // $companyCurrency = !empty($companyDetails) ?  $companyDetails['companyCurrency'] : [];
        $subscriberCurrency = model(Subscriber::class)->getCurrency($loginUser['subscriber_id']);
        $expenseDetails = $this->expenses->ByCompanyIdWithDates($newRequest);
        $incomesDetails = $this->invoicePayment->ByCompanyIdWithDates($newRequest)->getResultArray();
        $otherIncomesDetails = $this->incomes->ByCompanyIdWithDates($newRequest);

        $companyData = !empty($companyDetails) ?
            [
                'company_name' => $companyDetails['company_name'],
                'email' => $companyDetails['email'],
                'contact_number' => $companyDetails['contact_number'],
                'address_1' => $companyDetails['address_1'],
                'address_2' => $companyDetails['address_2'],
                'state' => $companyDetails['state'],
                'city' => $companyDetails['city'],
                'zip_code' => $companyDetails['zip_code'],
            ]
            : [];

        $incomes = [];
        $totalIncomeUSD =  0;
        $totalIncomeSubscriberCurrency = 0;
        if ($incomesDetails) {
            foreach ($incomesDetails as $key => $value) :
                $incomes[] = [
                    'title' => 'Sales',
                    'company_name' => $value['company_name'],
                    // 'company_amount' => format_amount($incomesDetails['company_currency_amount'], $companyCurrency['short_code'], $companyCurrency['locale']),
                    'subscriber_amount' => format_amount($value['subscriber_currency_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                    'usd_amount' =>  format_amount($value['USD_currency_amount'], 'USD', 'en_US'),
                ];
                $totalIncomeSubscriberCurrency  += $value['subscriber_currency_amount'];
                $totalIncomeUSD += $value['USD_currency_amount'];

            endforeach;
        }
        // $totalIncomeUSD = $incomesDetails ? $incomesDetails['USD_currency_amount'] : 0;
        // $totalIncomeSubscriberCurrency = $incomesDetails ? $incomesDetails['subscriber_currency_amount'] : 0;

        $otherIncomes = [];
        foreach ($otherIncomesDetails as $key => $value) :
            $otherIncomes[$key]['title']              = $value['title'];
            $otherIncomes[$key]['company_name']       = $value['company_name'];
            // $otherIncomes[$key]['company_amount']     = format_amount($value['amount'], $companyCurrency['short_code'], $companyCurrency['locale']);
            $otherIncomes[$key]['subscriber_amount']  = format_amount($value['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
            $otherIncomes[$key]['usd_amount']         = format_amount($value['USD_amount'], 'USD', 'en_US');
            $totalIncomeSubscriberCurrency += $value['subscriber_amount'];
            $totalIncomeUSD += $value['USD_amount'];
        endforeach;


        $expenses = [];
        $totalExpenseUSD = 0;
        $totalExpenseSubscriberCurrency = 0;
        foreach ($expenseDetails as $key => $value) :
            $expenses[$key]['title']              = $value['title'];
            $expenses[$key]['company_name']       = $value['company_name'];
            // $expenses[$key]['company_amount']     = format_amount($value['amount'], $companyCurrency['short_code'], $companyCurrency['locale']);
            $expenses[$key]['subscriber_amount']  = format_amount($value['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
            $expenses[$key]['usd_amount']         = format_amount($value['USD_amount'], 'USD', 'en_US');
            $totalExpenseSubscriberCurrency      += $value['subscriber_amount'];
            $totalExpenseUSD += $value['USD_amount'];
        endforeach;


        $profitLossUSD = $totalIncomeUSD - $totalExpenseUSD;
        $profitLossSubscriber = $totalIncomeSubscriberCurrency - $totalExpenseSubscriberCurrency;

        $response['company_id'] = $CompanyID;
        $response['start_date'] = $StartDate;
        $response['end_date'] = $EndDate;
        $response['USD_symbol'] = '$';
        $response['Subscriber_currency_symbol'] = $subscriberCurrency['currency_symbol'];
        $response['companyDetails'] = $companyData;
        $response['incomeDetails'] = $incomes;
        $response['otherIncomeDetails'] = $otherIncomes;
        $response['expenseDetails'] = $expenses;
        $response['total_income_subscriber_currency'] = format_amount($totalIncomeSubscriberCurrency, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
        $response['total_income_USD'] = format_amount($totalIncomeUSD, 'USD', 'en_US');
        $response['total_expense_subscriber_currency'] = format_amount($totalExpenseSubscriberCurrency, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
        $response['total_expense_USD'] = format_amount($totalExpenseUSD, 'USD', 'en_US');
        $response['profit_loss'] = ($profitLossSubscriber > 0) ? 'Profit' : 'Loss';
        $response['total_profit_loss_subscriber_currency'] = format_amount(abs($profitLossSubscriber), $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
        $response['total_profit_loss_amount_USD'] = format_amount(abs($profitLossUSD), 'USD', 'en_US');

        if (isset($request['type']) && $request['type'] == 'report') {

            $reportName = $CompanyID == 0 ? "All Companies" . ' profit loss' : $response['companyDetails']['company_name'] . ' profit loss';
            $fileName = str_replace(" ", "_", strtoupper($reportName)) . '.xlsx';
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $count = 2;

            // Profit-Loss income
            // Set Headers Start
            $sheet->setCellValue('A1', "Income")
                ->setCellValue('B1', '( ' . $response['Subscriber_currency_symbol'] . ' )')
                ->setCellValue('C1', '( ' . $response['USD_symbol'] . ' )');
            $sheet->getStyle('1')->getFont()->setBold(true);
            $sheet->getStyle('A1:C1')->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A1:C1')->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            // Set Headers End


            // Set Body Start
            $IncomeDetails = $response['incomeDetails'];
            foreach ($IncomeDetails as $key => $value) :
                $sheet->setCellValue('A' . $count, $value['title'] . ' - ' . $value['company_name'])
                    ->setCellValue('B' . $count, $value['subscriber_amount'])
                    ->setCellValue('C' . $count, $value['usd_amount']);
                $count++; # this count update with company
            endforeach;

            // Other incomes
            foreach ($response['otherIncomeDetails'] as $key => $value) :
                $sheet->setCellValue('A' . $count, $value['title'] . ' - ' . $value['company_name'])
                    ->setCellValue('B' . $count, $value['subscriber_amount'])
                    ->setCellValue('C' . $count, $value['usd_amount']);
                $count++; # this count update with company
            endforeach;

            $sheet->setCellValue('A' . $count, "Total Income")
                ->setCellValue('B' . $count, $response['total_income_subscriber_currency'])
                ->setCellValue('C' . $count,  $response['total_income_USD']);
            $sheet->getStyle($count)->getFont()->setBold(true);

            $sheet->getStyle('A1:C' . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $count += 2;
            $CurrentRow = $count;

            // Profit-Loss expense
            $sheet->setCellValue('A' . $count, "Expenses")
                ->setCellValue('B' . $count, '( ' . $response['Subscriber_currency_symbol'] . ' )')
                ->setCellValue('C' . $count, '( ' . $response['USD_symbol'] . ' )');
            $sheet->getStyle($count)->getFont()->setBold(true);
            $sheet->getStyle('A' . $count . ':C' . $count)->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A' . $count . ':C' . $count)->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            $count++;
            // Set Headers End


            // Set Body Start
            foreach ($response['expenseDetails'] as $key => $value) :
                $sheet->setCellValue('A' . $count, $value['title'] . ' - ' . $value['company_name'])
                    ->setCellValue('B' . $count, $value['subscriber_amount'])
                    ->setCellValue('C' . $count, $value['usd_amount']);
                $count++; # this count update with company
            endforeach;

            $sheet->setCellValue('A' . $count, "Total Expense")
                ->setCellValue('B' . $count, $response['total_expense_subscriber_currency'])
                ->setCellValue('C' . $count,  $response['total_expense_USD']);
            $sheet->getStyle($count)->getFont()->setBold(true);

            $sheet->getStyle('A' . $CurrentRow . ':C' . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $count += 2;

            // Profit-Loss Margin
            $sheet->setCellValue('A' . $count, $response['profit_loss'])
                ->setCellValue('B' . $count, $response['total_profit_loss_subscriber_currency'])
                ->setCellValue('C' . $count, $response['total_profit_loss_amount_USD']);
            if ($response['profit_loss'] === "Profit") {
                $sheet->getStyle('A' . $count . ':C' . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
            } else {
                $sheet->getStyle('A' . $count . ':C' . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
            };
            $sheet->getStyle('A' . $count . ':C' . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
            $sheet->getStyle($count)->getFont()->setBold(true);


            $sheet->getColumnDimension('A')->setAutoSize(TRUE);
            $sheet->getColumnDimension('B')->setAutoSize(TRUE);
            $sheet->getColumnDimension('C')->setAutoSize(TRUE);

            $writer = new Xlsx($spreadsheet);
            $writer->save($fileName);
            $filepath = FCPATH . $fileName;

            $getFile = file_get_contents($filepath);
            $data = 'data:application/vnd.ms-excel;base64,' . base64_encode($getFile);

            if (file_exists($filepath)) {
                @unlink($filepath);
            }
            $response = [
                'profit_loss_name' => $fileName,
                'profit_loss' => $data,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }




    // ================================================== Income Statement ================================================== //

    public function invoiceStatementInit()
    {
        $loginUser  = getTokenUser();
        $response['companyList'] = $this->company->getCompaniesByUser($loginUser);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function incomeStatementReport()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();
        $newRequest = array_merge($request, $loginUser);

        $CompanyID = $request['company_id'];
        $StartDate = $request['start_date'];
        $EndDate = $request['end_date'];

        $subscriberCurrency = model(Subscriber::class)->getCurrency($loginUser['subscriber_id']); # Get Subscriber Currency Details
        $companyDetails =  $CompanyID > 0 ? $this->company->withCurrency($CompanyID) : []; # Company Details
        $incomesDetails = $this->invoicePayment->ByCompanyIdWithDates_2($newRequest)->getResultArray();  # Income Details

        $companyData = !empty($companyDetails) ?
            [
                'company_name' => $companyDetails['company_name'],
                'email' => $companyDetails['email'],
                'contact_number' => $companyDetails['contact_number'],
                'address_1' => $companyDetails['address_1'],
                'address_2' => $companyDetails['address_2'],
                'state' => $companyDetails['state'],
                'city' => $companyDetails['city'],
                'zip_code' => $companyDetails['zip_code'],
            ]
            : [];

        $incomes = [];
        $totalIncomeUSD =  0;
        $totalIncomeSubscriberCurrency = 0;
        if ($incomesDetails) {

            foreach ($incomesDetails as $value) :
                $newRequest['company_id'] = $value['id'];
                $newRequest['start_date'] = $request['start_date'];
                $newRequest['end_date'] = $request['end_date'];

                $otherIncomes = $this->incomes->ByCatSubCat_New($newRequest);
                $totalIncomeSubscriberCurrency += array_sum(array_column($otherIncomes, 'subscriber_amount'));
                $totalIncomeUSD += array_sum(array_column($otherIncomes, 'USD_amount'));
                foreach ($otherIncomes as $key => $OIValue) :
                    $otherIncomes[$key]['subscriber_amount'] = format_amount($OIValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                    $otherIncomes[$key]['USD_amount'] = format_amount($OIValue['USD_amount'], 'USD', 'en_US');

                    foreach ($OIValue['sub_categories'] as $sKey => $sValue) :
                        $otherIncomes[$key]['sub_categories'][$sKey]['subscriber_amount'] = format_amount($sValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                        $otherIncomes[$key]['sub_categories'][$sKey]['USD_amount'] = format_amount($sValue['USD_amount'], 'USD', 'en_US');

                        foreach ($sValue['company'] as $cKey => $cValue) :
                            $otherIncomes[$key]['sub_categories'][$sKey]['company'][$cKey]['subscriber_amount'] = format_amount($cValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                            $otherIncomes[$key]['sub_categories'][$sKey]['company'][$cKey]['USD_amount'] = format_amount($cValue['USD_amount'], 'USD', 'en_US');

                            foreach ($cValue['incomes'] as $eKey => $eValue) :

                                $otherIncomes[$key]['sub_categories'][$sKey]['company'][$cKey]['incomes'][$eKey] = [
                                    'id' => $eValue['id'],
                                    'title' => $eValue['title'],
                                    'company_name' => $eValue['company_name'],
                                    'date' => $eValue['date'],
                                    'amount' => $eValue['amount'],
                                    'subscriber_amount' => format_amount($eValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                                    'USD_amount' =>  format_amount($eValue['USD_amount'], 'USD', 'en_US'),
                                ];
                            # End Experience Foreach
                            endforeach;
                        endforeach;


                    endforeach;

                endforeach;


                $clients = $this->invoicePayment->clientIDByPayments($newRequest)->getResultArray();
                $incomeByClient = $this->invoice->clientIncomeData($newRequest, $clients);

                foreach ($incomeByClient as $key => $ICValue) :

                    $incomeByClient[$key]['income'] = [
                        'USD_currency_total_amount' => format_amount($ICValue['income']['USD_currency_total_amount'], 'USD', 'en_US'),
                        'subscriber_currency_total_amount' => format_amount($ICValue['income']['subscriber_currency_total_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                        'company_currency_total_amount' => $ICValue['income']['company_currency_total_amount'],
                    ];
                endforeach;
                $incomes[] = [
                    'title' => 'Sales',
                    'company_name' => $value['company_name'],
                    'subscriber_amount' => format_amount($value['subscriber_currency_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                    'usd_amount' =>  format_amount($value['USD_currency_amount'], 'USD', 'en_US'),
                    'clients' => $incomeByClient,
                    'otherIncomes' => $otherIncomes
                ];

                $totalIncomeSubscriberCurrency  += $value['subscriber_currency_amount'];
                $totalIncomeUSD += $value['USD_currency_amount'];
            endforeach;
        }

        $response['company_id'] = $CompanyID;
        $response['start_date'] = $StartDate;
        $response['end_date'] = $EndDate;
        $response['USD_symbol'] = '$';
        $response['Subscriber_currency_symbol'] = $subscriberCurrency['currency_symbol'];
        $response['companyDetails'] = $companyData;
        $response['incomeDetails'] = $incomes;
        $response['total_income_subscriber_currency'] = format_amount($totalIncomeSubscriberCurrency, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
        $response['total_income_USD'] = format_amount($totalIncomeUSD, 'USD', 'en_US');

        // Parth
        if (isset($request['type']) && $request['type'] == 'report') {

            $reportName = $CompanyID == 0 ? "All Companies" . ' incomes' : $response['companyDetails']['company_name'] . ' incomes';
            $fileName = str_replace(" ", "_", strtoupper($reportName)) . '.xlsx';
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $count = 2;
            $headerAlpha = 'A';

            // Set Headers Start
            $HeaderColumnsCount = $CompanyID == 0 ? "4" : '3';
            $sheet->getColumnDimension('A')->setAutoSize(TRUE);
            for ($i = 1; $i < $HeaderColumnsCount; $i++) {
                $headerAlpha++;
                $sheet->getColumnDimension($headerAlpha)->setAutoSize(TRUE);
            }
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 1))->setAutoSize(TRUE);
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 2))->setAutoSize(TRUE);


            $sheet->setCellValue('A1', "Income")
                ->mergeCells('A1:' . $headerAlpha . '1')
                ->setCellValue(chr(ord($headerAlpha) + 1) . '1', '( ' . $response['Subscriber_currency_symbol'] . ' )')
                ->setCellValue(chr(ord($headerAlpha) + 2) . '1', '( ' . $response['USD_symbol'] . ' )');

            $sheet->getStyle('1')->getFont()->setBold(true);
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            // Set Headers End


            // Set Body Start
            $IncomeDetails = $response['incomeDetails'];
            foreach ($IncomeDetails as $key => $value) :
                $sheet->setCellValue('A' . $count, $value['title'] . ' - ' . $value['company_name'])
                    ->mergeCells('A' . $count . ':' . $headerAlpha . $count)
                    ->setCellValue(chr(ord($headerAlpha) + 1) . $count, $value['subscriber_amount'])
                    ->setCellValue(chr(ord($headerAlpha) + 2) . $count, $value['usd_amount'])
                    ->getStyle('A' . $count . ':' . chr(ord($headerAlpha) + 2) . $count)
                    ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('F5DEB3');

                $count++; # this count update with company

                // Company Clients
                foreach ($value['clients'] as $client) :
                    $sheet->setCellValue('A' . $count, $client['name'])
                        ->mergeCells('A' . $count . ':' . $headerAlpha . $count)
                        ->setCellValue(chr(ord($headerAlpha) + 1) . $count, $client['income']['subscriber_currency_total_amount'])
                        ->setCellValue(chr(ord($headerAlpha) + 2) . $count, $client['income']['USD_currency_total_amount']);
                    $count++; # this count update with clients
                endforeach;

                // Other income
                foreach ($value['otherIncomes'] as $OInc) :
                    // Category
                    $catCount = $count + $OInc['count'];
                    $sheet->setCellValue('A' . $count, $OInc['name'])
                        ->mergeCells('A' . $count . ':A' . $catCount - 1);

                    // SubCategory
                    foreach ($OInc['sub_categories'] as $SCat) :
                        $sCatCount = $count + $SCat['count'];
                        $sheet->setCellValue('B' . $count, $SCat['name'])
                            ->mergeCells('B' . $count . ':B' . $sCatCount - 1);

                        // Company
                        foreach ($SCat['company'] as $comp) :
                            $CampCount = $count + $comp['count'];
                            $CompanyID == 0 &&
                                $sheet->setCellValue('C' . $count, $comp['name'])
                                ->mergeCells('C' . $count . ':C' . $CampCount - 1);

                            $newAlpha = $CompanyID == 0 ? 'D' : 'C';

                            // Category Income
                            foreach ($comp['incomes'] as $CInc) :
                                $sheet->setCellValue($newAlpha . $count, $CInc['title']);
                                $sheet->setCellValue(chr(ord($newAlpha) + 1) . $count, $CInc['subscriber_amount']);
                                $sheet->setCellValue(chr(ord($newAlpha) + 2) . $count, $CInc['USD_amount']);
                                $count++;
                            endforeach;
                            $count = $CampCount;
                        endforeach;
                        $count = $sCatCount;
                    endforeach;
                    $count = $catCount;
                endforeach;
            endforeach;

            // Total Count
            $sheet->setCellValue('A' . $count, 'Total Income')
                ->mergeCells('A' . $count . ':' . $headerAlpha . $count)
                ->setCellValue(chr(ord($headerAlpha) + 1) . $count, $response['total_income_subscriber_currency'])
                ->setCellValue(chr(ord($headerAlpha) + 2) . $count, $response['total_income_USD'])
                ->getStyle('A' . $count . ':' . chr(ord($headerAlpha) + 2) . $count)
                ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setARGB('a6f1a6');

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $writer = new Xlsx($spreadsheet);
            $writer->save($fileName);
            $filepath = FCPATH . $fileName;

            $getFile = file_get_contents($filepath);
            $data = 'data:application/vnd.ms-excel;base64,' . base64_encode($getFile);

            if (file_exists($filepath)) {
                @unlink($filepath);
            }
            $response = [
                'income_name' => $fileName,
                'incomes' => $data,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function expenseStatementReport()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();
        $newRequest = array_merge($request, $loginUser);

        $CompanyID = $request['company_id'];
        $StartDate = $request['start_date'];
        $EndDate = $request['end_date'];

        $subscriberCurrency = model(Subscriber::class)->getCurrency($loginUser['subscriber_id']); # Get Subscriber Currency Details
        $companyDetails =  $CompanyID > 0 ? $this->company->withCurrency($CompanyID) : []; # Company Details

        // $expenses = $this->expenses->ByCatSubCat($newRequest);
        $expenses = $this->expenses->ByCatSubCat_New($newRequest);
        $totalSubscriberExpense = array_sum(array_column($expenses, 'subscriber_amount'));
        $totalInvoiceExpense = array_sum(array_column($expenses, 'USD_amount'));
        foreach ($expenses as $key => $value) :
            $expenses[$key]['subscriber_amount'] = format_amount($value['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
            $expenses[$key]['USD_amount'] = format_amount($value['USD_amount'], 'USD', 'en_US');

            foreach ($value['sub_categories'] as $sKey => $sValue) :
                $expenses[$key]['sub_categories'][$sKey]['subscriber_amount'] = format_amount($sValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $expenses[$key]['sub_categories'][$sKey]['USD_amount'] = format_amount($sValue['USD_amount'], 'USD', 'en_US');

                foreach ($sValue['company'] as $cKey => $cValue) :
                    $expenses[$key]['sub_categories'][$sKey]['company'][$cKey]['subscriber_amount'] = format_amount($cValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                    $expenses[$key]['sub_categories'][$sKey]['company'][$cKey]['USD_amount'] = format_amount($cValue['USD_amount'], 'USD', 'en_US');

                    foreach ($cValue['expenses'] as $eKey => $eValue) :

                        $expenses[$key]['sub_categories'][$sKey]['company'][$cKey]['expenses'][$eKey] = [
                            'id' => $eValue['id'],
                            'title' => $eValue['title'],
                            'company_name' => $eValue['company_name'],
                            'date' => $eValue['date'],
                            'amount' => $eValue['amount'],
                            'subscriber_amount' => format_amount($eValue['subscriber_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                            'USD_amount' =>  format_amount($eValue['USD_amount'], 'USD', 'en_US'),
                        ];
                    # End Experience Foreach
                    endforeach;
                endforeach;


            endforeach;

        endforeach;

        $companyData = !empty($companyDetails) ?
            [
                'company_name' => $companyDetails['company_name'],
                'email' => $companyDetails['email'],
                'contact_number' => $companyDetails['contact_number'],
                'address_1' => $companyDetails['address_1'],
                'address_2' => $companyDetails['address_2'],
                'state' => $companyDetails['state'],
                'city' => $companyDetails['city'],
                'zip_code' => $companyDetails['zip_code'],
            ]
            : [];


        $response['company_id'] = $CompanyID;
        $response['start_date'] = $StartDate;
        $response['end_date'] = $EndDate;
        $response['USD_symbol'] = '$';
        $response['Subscriber_currency_symbol'] = $subscriberCurrency['currency_symbol'];
        $response['companyDetails'] = $companyData;
        $response['expenses'] = $expenses;
        $response['total_income_subscriber_currency'] = format_amount($totalSubscriberExpense, $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
        $response['total_income_USD'] = format_amount($totalInvoiceExpense, 'USD', 'en_US');

        if (isset($request['type']) && $request['type'] == 'report') {

            $reportName = $CompanyID == 0 ? "All Companies" . ' expenses' : $response['companyDetails']['company_name'] . ' expenses';
            $fileName = str_replace(" ", "_", strtoupper($reportName)) . '.xlsx';
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $count = 2;
            $headerAlpha = 'A';

            // Set Headers Start
            $HeaderColumnsCount = $CompanyID == 0 ? "4" : '3';
            $sheet->getColumnDimension('A')->setAutoSize(TRUE);
            for ($i = 1; $i < $HeaderColumnsCount; $i++) {
                $headerAlpha++;
                $sheet->getColumnDimension($headerAlpha)->setAutoSize(TRUE);
            }
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 1))->setAutoSize(TRUE);
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 2))->setAutoSize(TRUE);


            $sheet->setCellValue('A1', "Expenses")
                ->mergeCells('A1:' . $headerAlpha . '1')
                ->setCellValue(chr(ord($headerAlpha) + 1) . '1', '( ' . $response['Subscriber_currency_symbol'] . ' )')
                ->setCellValue(chr(ord($headerAlpha) + 2) . '1', '( ' . $response['USD_symbol'] . ' )');

            $sheet->getStyle('1')->getFont()->setBold(true);
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            // Set Headers End


            // Set Body Start
            $ExpensesDetails = $response['expenses'];
            foreach ($ExpensesDetails as $OInc) :
                $catCount = $count + $OInc['count'];
                $sheet->setCellValue('A' . $count, $OInc['name'])
                    ->mergeCells('A' . $count . ':A' . $catCount - 1);

                // SubCategory
                foreach ($OInc['sub_categories'] as $SCat) :
                    $sCatCount = $count + $SCat['count'];
                    $sheet->setCellValue('B' . $count, $SCat['name'])
                        ->mergeCells('B' . $count . ':B' . $sCatCount - 1);

                    // Company
                    foreach ($SCat['company'] as $comp) :
                        $CampCount = $count + $comp['count'];
                        $CompanyID == 0 &&
                            $sheet->setCellValue('C' . $count, $comp['name'])
                            ->mergeCells('C' . $count . ':C' . $CampCount - 1);

                        $newAlpha = $CompanyID == 0 ? 'D' : 'C';

                        // Category Expenses
                        foreach ($comp['expenses'] as $CInc) :
                            $sheet->setCellValue($newAlpha . $count, $CInc['title']);
                            $sheet->setCellValue(chr(ord($newAlpha) + 1) . $count, $CInc['subscriber_amount']);
                            $sheet->setCellValue(chr(ord($newAlpha) + 2) . $count, $CInc['USD_amount']);
                            $count++;
                        endforeach;
                        $count = $CampCount;
                    endforeach;
                    $count = $sCatCount;
                endforeach;
                $count = $catCount;
            endforeach;
            // endforeach;

            // Total Count
            $sheet->setCellValue('A' . $count, 'Total Income')
                ->mergeCells('A' . $count . ':' . $headerAlpha . $count)
                ->setCellValue(chr(ord($headerAlpha) + 1) . $count, $response['total_income_subscriber_currency'])
                ->setCellValue(chr(ord($headerAlpha) + 2) . $count, $response['total_income_USD'])
                ->getStyle('A' . $count . ':' . chr(ord($headerAlpha) + 2) . $count)
                ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setARGB('a6f1a6');

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $writer = new Xlsx($spreadsheet);
            $writer->save($fileName);
            $filepath = FCPATH . $fileName;

            $getFile = file_get_contents($filepath);
            $data = 'data:application/vnd.ms-excel;base64,' . base64_encode($getFile);

            if (file_exists($filepath)) {
                @unlink($filepath);
            }
            $response = [
                'expense_name' => $fileName,
                'expenses' => $data,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function yoyReport()
    {
        $loginUser = getTokenUser();

        $request = $this->request->getPost();

        $subscriberCurrency = model(Subscriber::class)->getCurrency($loginUser['subscriber_id']); # Get Subscriber Currency Details

        $financialYear = new CompanyFinancialYear();
        $getYears = $financialYear->whereIn('id', $request['years'])->orderBy('start_date', 'ASC')->findAll();

        $fromDate = $getYears[0]['start_date'];
        $endDate = end($getYears)['end_date'];
        $getClientsIDS = $this->invoice->where("invoice_date BETWEEN '$fromDate' AND '$endDate'")->where('company_id', $request['company_id'])->groupBy('client_id')->findColumn('client_id');
        $getEXECategoryIDS = $this->expenses->where("date BETWEEN '$fromDate' AND '$endDate'")->where('company_id', $request['company_id'])->groupBy('category_id')->findColumn('category_id');
        $companyDetails = $request['company_id'] > 0 ? $this->company->withCurrency($request['company_id']) : [];

        $companyName = !empty($companyDetails) ?
            $companyDetails['company_name']
            : [];
        $response = [
            'USD_symbol' => '$',
            'Subscriber_currency_symbol' => $subscriberCurrency['currency_symbol'],
            'headers' => [],
            'incomes' => [],
            'expenses' => [],
            'companyName' => $companyName
        ];

        $totalIncomeArr = [];
        $totalExpensesArr = [];

        $incomes = $this->invoice->yoyReportIncome($getYears, $getClientsIDS);
        $expenses = $this->expenses->yoyReportExpenses($getYears, $getEXECategoryIDS);

        foreach ($getYears as $key => $value) :
            $headers = [
                'id' => $value['id'],
                'financial_year_name' => $value['financial_year_name'],
                'start_date' => $value['start_date'],
                'end_date' => $value['end_date'],
            ];
            $response['headers'][$key] = $headers;
            foreach ($incomes as $income) {
                $totalIncomeArr[$key][] = $income['income'][$key];
            }
            foreach ($expenses as $expense) {
                $totalExpensesArr[$key][] = $expense['expenses'][$key];
            }
        endforeach;

        // Income
        foreach ($incomes as $key =>  $income) {
            foreach ($income['income'] as $key1 => $value) :
                $incomes[$key]['income'][$key1]['USD_currency_total_amount'] = format_amount($value['USD_currency_total_amount'], 'USD', 'en_US');
                $incomes[$key]['income'][$key1]['subscriber_currency_total_amount'] = format_amount($value['subscriber_currency_total_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $incomes[$key]['income'][$key1]['company_currency_total_amount'] = $value['company_currency_total_amount'];
            endforeach;
        }

        // Expenses
        foreach ($expenses as $key =>  $expense) {
            foreach ($expense['expenses'] as $key1 => $value) :
                $expenses[$key]['expenses'][$key1]['USD_currency_total_amount'] = format_amount($value['USD_currency_total_amount'], 'USD', 'en_US');
                $expenses[$key]['expenses'][$key1]['subscriber_currency_total_amount'] = format_amount($value['subscriber_currency_total_amount'], $subscriberCurrency['short_code'], $subscriberCurrency['locale']);
                $expenses[$key]['expenses'][$key1]['company_currency_total_amount'] = $value['company_currency_total_amount'];
            endforeach;
        }

        $totalIncome = [];
        foreach ($totalIncomeArr as $key => $value) :
            $USD_total = array_sum(array_column($value, 'USD_currency_total_amount'));
            $Subscriber_total = array_sum(array_column($value, 'subscriber_currency_total_amount'));
            $Company_total = array_sum(array_column($value, 'company_currency_total_amount'));

            $type = '';
            if ($key > 0) {
                $getAmount = $totalIncome[$key - 1];
                if ($Company_total > $getAmount['company_currency_total_amount'])
                    $type = 'up';

                if ($Company_total < $getAmount['company_currency_total_amount'])
                    $type = 'down';
            }

            $totalIncome[] = [
                'USD_total' => $USD_total,
                'Subscriber_total' => $Subscriber_total,
                'Company_total' => $Company_total,
                'USD_currency_total_amount' => format_amount($USD_total, 'USD', 'en_US'),
                'subscriber_currency_total_amount' => format_amount($Subscriber_total, $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                'company_currency_total_amount' => $Company_total,
                'type' => $type
            ];
        endforeach;

        $totalExpenses = [];
        foreach ($totalExpensesArr as $key => $value) :
            $USD_total = array_sum(array_column($value, 'USD_currency_total_amount'));
            $Subscriber_total = array_sum(array_column($value, 'subscriber_currency_total_amount'));
            $Company_total = array_sum(array_column($value, 'company_currency_total_amount'));
            $type = '';
            if ($key > 0) {
                $getAmount = $totalExpenses[$key - 1];
                if ($Company_total > $getAmount['company_currency_total_amount'])
                    $type = 'up';

                if ($Company_total < $getAmount['company_currency_total_amount'])
                    $type = 'down';
            }

            $totalExpenses[] = [
                'USD_total' => $USD_total,
                'Subscriber_total' => $Subscriber_total,
                'Company_total' => $Company_total,
                'USD_currency_total_amount' => format_amount($USD_total, 'USD', 'en_US'),
                'subscriber_currency_total_amount' => format_amount($Subscriber_total, $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                'company_currency_total_amount' => $Company_total,
                'type' => $type
            ];
        endforeach;


        // Total Margin
        $totalMargin = [];
        foreach ($getYears as $key => $value) :
            $getIncome = $totalIncome[$key];
            $getExpense = $totalExpenses[$key];

            $USD_margin = $getIncome['USD_total'] - $getExpense['USD_total'];
            $Subscriber_margin = $getIncome['Subscriber_total'] - $getExpense['Subscriber_total'];
            $Company_margin = $getIncome['Company_total'] - $getExpense['Company_total'];

            $type = '';
            if ($key > 0) {
                $getAmount = $totalMargin[$key - 1];
                if ($Company_margin > $getAmount['company_currency_total_amount'])
                    $type = 'up';

                if ($Company_margin < $getAmount['company_currency_total_amount'])
                    $type = 'down';
            }
            $totalMargin[] = [
                'USD_currency_total_amount' => format_amount($USD_margin, 'USD', 'en_US'),
                'subscriber_currency_total_amount' => format_amount($Subscriber_margin, $subscriberCurrency['short_code'], $subscriberCurrency['locale']),
                'company_currency_total_amount' => $Company_margin,
                'type' => $type
            ];
        endforeach;


        $response['company_id'] = $request['company_id'];
        $response['financial_ids'] = $request['years'];
        $response['incomes'] = $incomes;
        $response['total_incomes'] = $totalIncome;
        $response['total_expenses'] = $totalExpenses;
        $response['total_margin'] = $totalMargin;
        $response['expenses'] = $expenses;

        if (isset($request['type']) && $request['type'] == 'report') {
            $reportName = $response["companyName"] . ' Year over Year Report';
            $fileName = str_replace(" ", "_", strtoupper($reportName)) . '.xlsx';
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $count = 3;
            $headerAlpha = 'A';

            // Set Headers Start
            $sheet->getColumnDimension('A')->setAutoSize(TRUE);
            $AutoWidth = $headerAlpha;
            foreach ($response['financial_ids'] as $value) :
                $AutoWidth++;
                $sheet->getColumnDimension($AutoWidth)->setAutoSize(TRUE);
                $sheet->getColumnDimension(++$AutoWidth)->setAutoSize(TRUE);
            endforeach;

            // Incomes
            $sheet->setCellValue('A1', "Incomes")->mergeCells('A1:A2');

            $sheet->getStyle('1')->getFont()->setBold(true);

            $incomeYear = $headerAlpha;
            foreach ($response['headers'] as $value) :
                $incomeYear++;
                $case = $incomeYear;
                $case++;
                $sheet->setCellValue($incomeYear . '1', $value['financial_year_name']);
                $sheet->mergeCells($incomeYear . '1:' . $case . '1');
                $sheet->setCellValue($incomeYear . '2', '( ' . $response['Subscriber_currency_symbol'] . ' )')
                    ->setCellValue(++$incomeYear . '2', '( ' . $response['USD_symbol'] . ' )');
            endforeach;
            // Set Headers End
            $headerAlpha++;

            // Set Body Start
            foreach ($response['incomes'] as $value) :
                $sheet->setCellValue('A' . $count, $value['name']);
                $CurrencyAmount = $headerAlpha;
                foreach ($value['income'] as $CIncome) :
                    $colorCurrency = $CurrencyAmount;
                    $colorCurrency++;

                    if ($CIncome['type'] === "up") {
                        $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                        $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                    } elseif ($CIncome['type'] === "down") {
                        $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                        $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                    };
                    $sheet->setCellValue($CurrencyAmount . $count, $CIncome['subscriber_currency_total_amount']);
                    $sheet->setCellValue(++$CurrencyAmount . $count, $CIncome['USD_currency_total_amount']);
                    $CurrencyAmount++;
                endforeach;
                $count++;
            endforeach;

            $sheet->setCellValue('A' . $count, 'Total');
            $CurrencyAmount = $headerAlpha;
            foreach ($response['total_incomes'] as $value) :
                $colorCurrency = $CurrencyAmount;
                $colorCurrency++;
                if ($value['type'] === "up") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                } elseif ($value['type'] === "down") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                };
                $sheet->setCellValue($CurrencyAmount . $count, $value['subscriber_currency_total_amount']);
                $sheet->setCellValue(++$CurrencyAmount . $count, $value['USD_currency_total_amount']);
                $CurrencyAmount++;
            endforeach;

            $sheet->getStyle($count)->getFont()->setBold(true);
            $count++;

            // Expenses
            $addExtraSpace = $count;
            $addExtraSpace++;
            $sheet->setCellValue('A' . $count, "Expenses")
                ->mergeCells('A' . $count . ':A' . $addExtraSpace);

            $sheet->getStyle($count)->getFont()->setBold(true);
            $expenseYear = $headerAlpha;
            foreach ($response['headers'] as $value) :
                $expenseYearCounter = $count;
                $case = $expenseYear;
                $case++;
                $sheet->setCellValue($expenseYear . $expenseYearCounter, $value['financial_year_name']);
                $sheet->mergeCells($expenseYear . $expenseYearCounter . ':' . $case . $expenseYearCounter);
                $sheet->setCellValue($expenseYear . ++$expenseYearCounter, '( ' . $response['Subscriber_currency_symbol'] . ' )')
                    ->setCellValue(++$expenseYear . $expenseYearCounter, '( ' . $response['USD_symbol'] . ' )');
                $expenseYear++;
            endforeach;

            $sheet->getStyle('A' . $count . ':' . $incomeYear . $expenseYearCounter)->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A' . $count . ':' . $incomeYear . $expenseYearCounter)
                ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

            $sheet->getStyle('A' . $count . ':' . $incomeYear . ++$count)->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            $count++;

            foreach ($response['expenses'] as $value) :
                $sheet->setCellValue('A' . $count, $value['name']);
                $CurrencyAmount = $headerAlpha;
                foreach ($value['expenses'] as $CExpense) :
                    if ($CExpense['type'] === "up") {
                        $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                        $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                    } elseif ($CExpense['type'] === "down") {
                        $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                        $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                    };
                    $sheet->setCellValue($CurrencyAmount . $count, $CExpense['subscriber_currency_total_amount']);
                    $sheet->setCellValue(++$CurrencyAmount . $count, $CExpense['USD_currency_total_amount']);
                    $CurrencyAmount++;
                endforeach;
                $count++;
            endforeach;

            $sheet->setCellValue('A' . $count, 'Total');
            $CurrencyAmount = $headerAlpha;
            foreach ($response['total_expenses'] as $value) :
                $colorCurrency = $CurrencyAmount;
                $colorCurrency++;
                if ($value['type'] === "up") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                } elseif ($value['type'] === "down") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                };
                $sheet->setCellValue($CurrencyAmount . $count, $value['subscriber_currency_total_amount']);
                $sheet->setCellValue(++$CurrencyAmount . $count, $value['USD_currency_total_amount']);
                $CurrencyAmount++;
            endforeach;

            $sheet->getStyle($count)->getFont()->setBold(true);
            $count++;

            $sheet->setCellValue('A' . $count, 'Total Margin');
            $CurrencyAmount = $headerAlpha;
            $sheet->getStyle('A' . $count . ':' . $incomeYear . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setARGB('F5DEB3');
            $sheet->getStyle($count)->getFont()->setBold(true);
            foreach ($response['total_margin'] as $value) :
                $colorCurrency = $CurrencyAmount;
                $colorCurrency++;
                if ($value['type'] === "up") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('90EE90');
                } elseif ($value['type'] === "down") {
                    $sheet->getStyle($CurrencyAmount . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                    $sheet->getStyle($colorCurrency . $count)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF726F');
                };
                $sheet->setCellValue($CurrencyAmount . $count, $value['subscriber_currency_total_amount']);
                $sheet->setCellValue(++$CurrencyAmount . $count, $value['USD_currency_total_amount']);
                $CurrencyAmount++;
            endforeach;


            $sheet->getStyle('A1:' . $incomeYear . '2')->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A1:' . $incomeYear . $count)
                ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

            $sheet->getStyle('A1:' . $incomeYear . '2')->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');

            $sheet->getStyle('A1:' . $incomeYear . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $writer = new Xlsx($spreadsheet);
            $writer->save($fileName);
            $filepath = FCPATH . $fileName;

            $getFile = file_get_contents($filepath);
            $data = 'data:application/vnd.ms-excel;base64,' . base64_encode($getFile);

            if (file_exists($filepath)) {
                @unlink($filepath);
            }
            $response = [
                'yoy_name' => $fileName,
                'yoy_data' => $data,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * Client Report 
     */
    public function clientReport()
    {
        $loginUser = getTokenUser();
        $request = $this->request->getPost();
        $newRequest = array_merge($request, $loginUser);

        $ClientID = $request['client_id'];
        $StartDate = $request['start_date'];
        $EndDate = $request['end_date'];

        $subscriberCurrency = model(Subscriber::class)->getCurrency($loginUser['subscriber_id']); # Get Subscriber Currency Details

        $clientData = model(Client::class)->clientReportData($newRequest, $subscriberCurrency);

        $response['client_id'] = $ClientID;
        $response['start_date'] = $StartDate;
        $response['end_date'] = $EndDate;
        $response['USD_symbol'] = '$';
        $response['Subscriber_currency_symbol'] = $subscriberCurrency['currency_symbol'];
        $response['clientInvoiceData'] = $clientData['data'];
        $response['total_subscriber_currency'] = $clientData['total_subscriber_currency'];
        $response['total_USD'] = $clientData['total_usd_currency'];

        if (isset($request['type']) && $request['type'] == 'report') {

            $reportName = $ClientID == 0 ? "All Clients" . ' report' : $response['clientInvoiceData'][0]['client_name'] . ' report';
            $fileName = str_replace(" ", "_", strtoupper($reportName)) . '.xlsx';
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $count = 2;
            $headerAlpha = 'A';

            // Set Headers Start
            // $HeaderColumnsCount = $ClientID == 0 ? "4" : '3';
            $HeaderColumnsCount = '3';
            $sheet->getColumnDimension('A')->setAutoSize(TRUE);
            for ($i = 1; $i < $HeaderColumnsCount; $i++) {
                $headerAlpha++;
                $sheet->getColumnDimension($headerAlpha)->setAutoSize(TRUE);
            }
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 1))->setAutoSize(TRUE);
            $sheet->getColumnDimension(chr(ord($headerAlpha) + 2))->setAutoSize(TRUE);


            $sheet->setCellValue('A1', "Clients")
                ->mergeCells('A1:' . $headerAlpha . '1')
                ->setCellValue(chr(ord($headerAlpha) + 1) . '1', '( ' . $response['Subscriber_currency_symbol'] . ' )')
                ->setCellValue(chr(ord($headerAlpha) + 2) . '1', '( ' . $response['USD_symbol'] . ' )');

            $sheet->getStyle('1')->getFont()->setBold(true);
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getAlignment()->setHorizontal('center');
            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . '1')->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('add8e6');
            // Set Headers End


            // Set Body Start
            $clientInvoiceData = $response['clientInvoiceData'];
            foreach ($clientInvoiceData as $SCat) :
                $sCatCount = $count + $SCat['count'];
                // $ClientID == 0 &&
                $sheet->setCellValue('A' . $count, $SCat['client_company_name'] . ' - ' . $SCat['client_name'])
                    ->mergeCells('A' . $count . ':A' . $sCatCount - 1);

                // Company
                foreach ($SCat['companies'] as $comp) :
                    if ($comp['count'] != 0) {
                        $CampCount = $count + $comp['count'];
                        $sheet->setCellValue('B' . $count, $comp['company_name'])
                            ->mergeCells('B' . $count . ':B' . $CampCount - 1);
                    }

                    // // $newAlpha = $ClientID == 0 ? 'D' : 'C';
                    $newAlpha = 'C';

                    // Invoices
                    foreach ($comp['invoices'] as $CInc) :
                        $sheet->setCellValue($newAlpha . $count, $CInc['invoice_no']);
                        $sheet->setCellValue(chr(ord($newAlpha) + 1) . $count, $CInc['subscriber_currency_total_amount']);
                        $sheet->setCellValue(chr(ord($newAlpha) + 2) . $count, $CInc['USD_currency_total_amount']);
                        $count++;
                    endforeach;
                    $count = $CampCount;
                endforeach;
                $count = $sCatCount;
            endforeach;

            // Total Count
            $sheet->setCellValue('A' . $count, 'Total')
                ->mergeCells('A' . $count . ':' . $headerAlpha . $count)
                ->setCellValue(chr(ord($headerAlpha) + 1) . $count, $response['total_subscriber_currency'])
                ->setCellValue(chr(ord($headerAlpha) + 2) . $count, $response['total_USD'])
                ->getStyle('A' . $count . ':' . chr(ord($headerAlpha) + 2) . $count)
                ->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                ->getStartColor()->setARGB('a6f1a6');

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

            $sheet->getStyle('A1:' . chr(ord($headerAlpha) + 2) . $count)
                ->getBorders()->getAllBorders()
                ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

            $writer = new Xlsx($spreadsheet);
            $writer->save($fileName);
            $filepath = FCPATH . $fileName;

            $getFile = file_get_contents($filepath);
            $data = 'data:application/vnd.ms-excel;base64,' . base64_encode($getFile);

            if (file_exists($filepath)) {
                @unlink($filepath);
            }
            $response = [
                'client_report_name' => $fileName,
                'client_report' => $data,
            ];
        }

        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    public function clientList()
    {
        $loginUser = getTokenUser();
        $data = model(Client::class)->ClientBySubscriber($loginUser['subscriber_id']);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $data]);
    }
}
