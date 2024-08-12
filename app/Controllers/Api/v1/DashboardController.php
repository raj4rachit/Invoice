<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use App\Models\Currency;
use App\Models\Dashboard;
use App\Models\Invoice;
use App\Models\Subscriber;
use CodeIgniter\API\ResponseTrait;

class DashboardController extends BaseController
{
    use ResponseTrait;
    protected $invoice;
    protected $dashboard;

    public function __construct()
    {
        $this->invoice = new Invoice();
        $this->dashboard = new Dashboard();
    }

    public function index()
    {
        $request = $this->request->getGet();

        $selectedCompany = getSelectedCompany();
        $userData = getTokenUser();
        // Get Currencies
        $subscriberCurrency             = model(Subscriber::class)->getCurrency($userData['subscriber_id']);
        $subscriberCurrency['action']   = 'subscriber';

        $useCurrency            = model(Currency::class)->ByShortCode('USD');
        $useCurrency['action']  = 'default';


        if (empty($request)) {
            $currencyData = [
                'id' => $subscriberCurrency['id'],
                'action' => 'subscriber'
            ];
        } else {
            $currencyData = $request;
        }

        $cardData = $this->dashboard->SubscriberCardData($userData, $selectedCompany);
        $IncomeExpenseCardData = $this->dashboard->SubscriberIncomeExpenseData($userData, $selectedCompany);

        $currency = [];
        $currency[] = $subscriberCurrency;
        $currency[] = $useCurrency;

        $response = [];
        $response['chartData']      = $this->invoice->yearlyChart($userData, $selectedCompany, $currencyData);
        $response['yearCard']       = $cardData['year'];
        $response['monthCard']      = $cardData['month'];
        $response['income_expense'] = $IncomeExpenseCardData;
        $response['currencyList']   = $currency;
        $response['currencyData']   = $currencyData;
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }

    /**
     * Selected Date Wise Card Data
     */
    public function CardDataByDates()
    {
        $request = $this->request->getGet();
        $selectedCompany = getSelectedCompany();
        $userData = getTokenUser();
        $response =  $this->dashboard->SubscriberDatesByCardData($userData, $selectedCompany, $request);
        return $this->respond(['status' => SUCCESS_ST, 'status_code' => 200, 'data' => $response]);
    }
}
