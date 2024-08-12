<?php

namespace App\Controllers;

use App\Models\ExpenseCategory;
use App\Models\Invoice;
use CodeIgniter\I18n\Time;
use Exception;

class Home extends BaseController
{
    public function index()
    {
        return view('frontend');
    }

    public function testing()
    {
        return view('test');
    }

    public function testingPost()
    {
        $request = $this->request->getPost();
        echo "<pre>";

        $newArray = [];
        foreach ($request['id'] as $key => $value) {
            $newArray[] = [
                'id' => $value,
                'order' => $key,
            ];
        }

        print_r($newArray);
        die;
    }

    public function reCalAmount()
    {
        $invoices = model(Invoice::class)->findAll();

        foreach ($invoices as $key => $value) :
            $subTotal = $value['subtotal'];
            $company_ccr = $value['currency_conversion_rate'];
            $subscriber_ccr = $value['subscriber_currency_conversion_rate'];
            $USD_ccr = $value['USD_currency_conversion_rate'];

            $invoices[$key]['company_currency_total_amount'] = number_format($company_ccr * $subTotal, 2, '.', '');
            $invoices[$key]['subscriber_currency_total_amount'] = number_format($subscriber_ccr * $subTotal, 2, '.', '');
            $invoices[$key]['USD_currency_total_amount'] = number_format($USD_ccr * $subTotal, 2, '.', '');
        endforeach;
        $updateData = model(Invoice::class)->updateBatch($invoices, 'id');
        echo "Total $updateData Invoices update";
    }

    public function addSubscriberCurrencyInInvoice()
    {
        $invoices = model(Invoice::class)
            ->select('invoices.*, subscribers.id as sub_currency_id')
            ->join('subscribers', 'subscribers.id=invoices.subscriber_id', 'LEFT')
            ->findAll();
        // $updateData = [];
        foreach ($invoices as $key => $value) :
            $invoices[$key]['subscriber_currency_id'] = $value['sub_currency_id'];
        endforeach;

        $updateData = model(Invoice::class)->updateBatch($invoices, 'id');
        echo "Total $updateData Invoices update";
    }


    public function copyExpenseCategory()
    {
        $expCategory = new ExpenseCategory();
        $getAllCategories  = $expCategory->where('subscriber_id', 1)->where('parent_id', null)->findAll();
        foreach ($getAllCategories as $key => $value) :
            $subCategory = $expCategory->where('subscriber_id', 1)->where('parent_id', $value['id'])->findAll();
            $getAllCategories[$key]['sub_category'] = $subCategory;
        endforeach;

        try {
            $newSubscriber = 4;
            foreach ($getAllCategories as $value) :
                $newData = [
                    'subscriber_id' => $newSubscriber,
                    'name' => $value['name'],
                    'parent_id' => null,
                    'status' => $value['status'],
                    'created_by' => 1,
                    'created_at' => Time::now(),
                ];

                $catID = $expCategory->insert($newData);
                foreach ($value['sub_category'] as $value1) :
                    $newSubData = [
                        'subscriber_id' => $newSubscriber,
                        'name' => $value1['name'],
                        'parent_id' => $catID,
                        'status' => $value1['status'],
                        'created_by' => 1,
                        'created_at' => Time::now(),
                    ];
                    $expCategory->insert($newSubData);
                endforeach;
            endforeach;
        } catch (Exception $err) {

            echo '<pre>';
            print_r($err->getMessage());
            die;
        }


        echo '<pre>';
        print_r('InsertNew');
        die;
    }
}
