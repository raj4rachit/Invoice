<?php

/**************************************
 * Get first error message from array *
 **************************************/

use App\Models\AppToken;
use App\Models\User;

if (!function_exists('GET_VALIDATION_MSG')) {

    /**
     * @param array $errors
     * @return string
     */
    function GET_VALIDATION_MSG(array $errors)
    {
        $error = '';
        foreach ($errors as $val) {
            $error = $val;
            break;
        }
        return $error;
    }
}


/**************************************
 *        Get Client IP Address       *
 **************************************/
if (!function_exists("getClientIpAddress")) {

    function getClientIpAddress()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //Checking IP From Shared Internet
        {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //To Check IP is Pass From Proxy
        {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }
}

/*****************************************
 *    Return Response in Json Formate    *
 *****************************************/
if (!function_exists('json_response')) {
    function json_response($message = null, $code = 200)
    {
        header_remove();
        http_response_code($code);
        header('Content-Type: application/json');
        $status = array(
            200 => '200 OK',
            400 => '400 Bad Request',
            401 => '401 unauthorized',
            404 => '404 Not Found',
            422 => 'Unprocessable Entity',
            500 => '500 Internal Server Error'
        );
        header('Status: ' . $status[$code]);
        exit(json_encode($message));
    }
}

/**************************************
 *          Check User Token          *
 **************************************/
if (!function_exists("getToken")) {

    function getToken()
    {
        $headerData =  getallheaders();
        if (isset($headerData['Authorization'])) {
            $app_token = $headerData['Authorization'];
        } elseif (isset($headerData['authorization'])) {
            $app_token = $headerData['authorization'];
        } else {
            $app_token = '';
        }

        return $app_token;
    }
}

/**************************************
 *          Check User Token          *
 **************************************/
if (!function_exists("checkToken")) {

    function checkToken()
    {
        $headerData =  getallheaders();
        if (isset($headerData['Authorization'])) {
            $app_token = $headerData['Authorization'];
        } elseif (isset($headerData['authorization'])) {
            $app_token = $headerData['authorization'];
        } else {
            json_response([
                'status' => 0,
                'status_code' => 401,
                'message' => 'Token is missing.'
            ], 401);
        }

        $appToken = new AppToken();
        if ($appToken->where('token', $app_token)->first()) {
            return true;
        } else {
            json_response([
                'status' => 0,
                'status_code' => 401,
                'message' => 'Invalid Token.'
            ], 401);
        }
    }
}

/*****************************************
 *            GET Token User ID          *
 *****************************************/
if (!function_exists('getTokenUserID')) {
    function getTokenUserID()
    {
        return model(AppToken::class)->__getTokenUserID();
    }
}
/*****************************************
 *            GET Token User             *
 *****************************************/
if (!function_exists('getTokenUser')) {
    function getTokenUser()
    {
        $userID = getTokenUserID();
        return model(User::class)->find($userID);
    }
}

/*****************************************
 *    GET Selected compnay and year      *
 *****************************************/
if (!function_exists('getSelectedCompany')) {
    function getSelectedCompany()
    {
        $headerData =  getallheaders();
        if (isset($headerData['Company'])) {
            $company = $headerData['Company'];
        } elseif (isset($headerData['company'])) {
            $company = $headerData['company'];
        } else {
            json_response([
                'status' => 0,
                'status_code' => 401,
                'message' => 'company data is missing.'
            ], 401);
        }
        $companyDetail = json_decode($company);
        return $companyDetail;
    }
}



/*****************************************
 *    Amount format function             *
 *****************************************/
if (!function_exists('format_amount')) {
    function format_amount($amount = 0, $currency = "INR", $locale = "en_IN", $fraction = 2)
    {
        $convertedAmount = number_to_currency($amount, $currency, $locale, $fraction);
        return $convertedAmount;
    }
}


/*****************************
 *      Get Company IDS      *
 *****************************/
if (!function_exists('getCompanyIDS')) {
    function getCompanyIDS($loginUser, $selectedCompany)
    {
        print_r($loginUser);
        print_r($selectedCompany);
        die;
    }
}



/*****************************
 *        Check Date         *
 *****************************/
if (!function_exists('checkSubscriberDate')) {
    function checkSubscriberDate($startDate, $endDate)
    {
        $start_date = date('Y', strtotime($startDate));
        $end_date = date('Y', strtotime($endDate));
        if ($start_date === $end_date) {
            return [
                'start_date' => date('Y') . date('-m-d', strtotime($startDate)),
                'end_date' => date('Y') . date('-m-d', strtotime($endDate))
            ];
        } else {
            $Today = date('Y-m-d');
            $getDiff = $end_date - $start_date;
            if (strtotime($end_date . '-01-01') <= strtotime($Today) && strtotime($Today) <= strtotime($endDate)) {

                $startYear = $end_date - $getDiff;
                return [
                    'start_date' => $startYear . date('-m-d', strtotime($startDate)),
                    'end_date' => date('Y') . date('-m-d', strtotime($endDate))
                ];
            } else {
                $endYear = $end_date + $getDiff;
                $startYear = $start_date + $getDiff;
                return [
                    // 'start_date' => date('Y') . date('-m-d', strtotime($startDate)),
                    'start_date' => $startYear . date('-m-d', strtotime($startDate)),
                    'end_date' => $endYear . date('-m-d', strtotime($endDate))
                ];
            }
        }
    }
}
