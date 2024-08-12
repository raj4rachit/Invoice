-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 07, 2023 at 09:29 AM
-- Server version: 5.7.24
-- PHP Version: 8.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cr_ibsystem`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `clients_CRUD` (IN `clientID` INT, IN `subscriberID` INT, IN `clientName` VARCHAR(100), IN `companyName` VARCHAR(100), IN `enrollDate` DATE, IN `taxNo` VARCHAR(100), IN `gstVatNo` VARCHAR(100), IN `email` VARCHAR(100), IN `phone` VARCHAR(100), IN `address1` VARCHAR(100), IN `address2` VARCHAR(100), IN `city` VARCHAR(100), IN `state` VARCHAR(100), IN `zipCode` VARCHAR(100), IN `countryID` INT, IN `sourceBy` INT, IN `sourceFrom` INT, IN `clientGroupID` INT, IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN
IF action = 'Insert' THEN
INSERT INTO clients
(subscriber_id
 ,client_name
 ,company_name
 ,enroll_date
 ,tax_no
 ,gst_vat_no
 ,email
 ,phone
 ,address_1
 ,address_2
 ,city
 ,state
 ,zip_code
 ,country_id
 ,source_by 
 ,source_from 
 ,client_group_id 
 ,status
 ,created_by 
 ,updated_by
 ,created_at
 ,updated_at
)
VALUES
(clientID
 ,subscriberID
 ,clientName
 ,companyName
 ,enrollDate
 ,taxNo
 ,gstVatNo
 ,email
 ,phone
 ,address1
 ,address2
 ,city
 ,state
 ,zipCode
 ,countryID
 ,sourceBy
 ,sourceFrom
 ,clientGroupID
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE clients
SET
 subscriber_id = subscriberID
 ,client_name = clientName
 ,company_name = companyName
 ,enroll_date  = enrollDate
 ,tax_no = taxNo
 ,gst_vat_no = gstVatNo
 ,email = email
 ,phone = phone
 ,address_1 = address1
 ,address_2 = address2
 ,city = city
 ,state = state
 ,zip_code = zipCode
 ,country_id = countryID
 ,source_by = sourceBy
 ,source_from = sourceFrom
 ,client_group_id = clientGroupID
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = clientID;
 END IF;

IF action = 'Delete' THEN
DELETE FROM clients
WHERE id = clientID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `clients_Groups_CRUD` (IN `clientGroupID` INT, IN `subscriberID` INT, IN `groupName` VARCHAR(100), IN `description` TEXT, IN `status` ENUM('active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO client_groups
(subscriber_id  
 ,group_name
 ,description
 ,status
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
(subscriberID
 ,groupName
 ,description
 ,status 
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE client_groups
SET
 subscriber_id = subscriberID
 ,group_name = groupName
 ,description = description
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = clientGroupID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM client_groups
 WHERE id = clientGroupID;
 END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `companies_CRUD` (IN `companyID` INT, IN `subscriberID` INT, IN `companyName` VARCHAR(255), IN `tradingName` VARCHAR(100), IN `email` VARCHAR(100), IN `contactNumber` VARCHAR(100), IN `website` VARCHAR(100), IN `registrationNo` VARCHAR(100), IN `enrollDate` DATE, IN `taxNo` VARCHAR(100), IN `gstVatNo` VARCHAR(100), IN `currencyID` INT, IN `address1` VARCHAR(100), IN `address2` VARCHAR(200), IN `city` VARCHAR(100), IN `state` VARCHAR(100), IN `zipCode` VARCHAR(100), IN `countryID` INT, IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO companies
( subscriber_id 
 ,company_name
 ,trading_name
 ,email
 ,contact_number
 ,website
 ,registration_no
 ,enroll_date
 ,tax_no
 ,gst_vat_no
 ,currency_id 
 ,address_1
 ,address_2
 ,city
 ,state
 ,zip_code
 ,country_id 
 ,status	
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
( subscriberID
 ,companyName
 ,tradingName
 ,email
 ,contactNumber
 ,website
 ,registrationNo
 ,enrollDate
 ,taxNo
 ,gstVatNo
 ,currencyID
 ,address1
 ,address2
 ,city
 ,state
 ,zipCode
 ,countryID
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE companies
SET
  subscriber_id = subscriberID
 ,company_name = companyName
 ,trading_name = tradingName
 ,email = email
 ,contact_number = contactNumber
 ,website = website
 ,registration_no = registrationNo
 ,enroll_date = enrollDate
 ,tax_no = taxNo
 ,gst_vat_no = gstVatNo
 ,currency_id = currencyID
 ,address_1 = address1
 ,address_2 = address2
 ,city = city
 ,state = state
 ,zip_code = zipCode
 ,country_id = countryID
 ,status = status	
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
WHERE id =  companyID;
END IF;

IF action = 'Delete' THEN
DELETE FROM companies
WHERE id = companyID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `countries_CRUD` (IN `CountryID` INT, IN `Country` VARCHAR(100), IN `status` ENUM('Active','Inactive'), IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO countries
(country_name
 ,status
 ,created_at
 ,updated_at
)
VALUES
(Country
 ,status
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE countries
SET
country_name = Country
 ,status = status
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = CountryID;
END IF;

IF action = 'Delete' THEN
DELETE FROM countries
WHERE id = CountryID;
END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `countryTaxes_CRUD` (IN `countryTaxesID` INT, IN `countryID` INT, IN `taxName` VARCHAR(255), IN `ctrate` INT, IN `isPercentage` ENUM('Yes','No'), IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO country_taxes
(country_id 
 ,tax_name
 ,rate
 ,is_percentage
 ,status
 ,created_by
 ,updated_by
 ,created_at
 ,updated_at
)
VALUES
(countryID
 ,taxName
 ,ctrate
 ,isPercentage
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE country_taxes
SET
  country_id = countryID
 ,tax_name = taxName
 ,rate = ctrate
 ,is_percentage = isPercentage
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = countryTaxesID;
 END IF;

IF action = 'Delete' THEN
DELETE FROM country_taxes
WHERE id = countryTaxesID;
END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `currencies_CRUD` (IN `currencyID` INT, IN `currencyName` VARCHAR(100), IN `currencySymbol` VARCHAR(100), IN `shortCode` VARCHAR(100), IN `status` ENUM('Active','Inactive'), IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO currencies
(currency_name
 ,currency_symbol
 ,short_code
 ,status
 ,created_at
 ,updated_at
 )
 VALUES
 (currencyName
  ,currencySymbol
  ,shortCode
  ,status
  ,createdAt
  ,updatedAt
 );
 END IF;
 
 IF action = 'Update' THEN
 UPDATE currencies
 SET
 currency_name = currencyName
 ,currency_symbol = currencySymbol
 ,short_code = shortCode
 ,status = status
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = currencyID;
 END IF;

IF action = 'Delete' THEN
DELETE FROM currencies
WHERE id = currencyID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBadDebt` (IN `startdate` DATE, IN `enddate` DATE)   BEGIN
SELECT SUM(ip.invoice_currency_amount) AS BadDebt
FROM invoice_payments AS ip
INNER JOIN invoices AS i ON ip.invoice_id = i.id
WHERE ip.status = 'Bad Debt'
AND (i.invoice_date >= startdate
AND i.invoice_date <= enddate);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBadDeptAndTds` (IN `startdate` DATE, IN `enddate` DATE, IN `companyID` INT, IN `subscriberID` INT)   BEGIN
IF companyID = 0 THEN
SELECT  SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        AND ip.status != 'Bad Debt'
                        THEN ip.company_currency_amount
                        ELSE 0 END) AS Received,

         SUM(CASE WHEN (ip.payment_date >= startdate 
                       AND ip.payment_date <= enddate)
                       AND ip.status = 'Bad Debt'
                       THEN ip.invoice_currency_amount
                       ELSE 0 END) AS BadDebt,
          
          SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        THEN ip.tds
                        ELSE 0 END) AS TDS
FROM invoice_payments AS ip              
INNER JOIN invoices AS i ON ip.invoice_id = i.id
AND subscriber_id = subscriberID;
ELSE
SELECT  SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        AND ip.status != 'Bad Debt'
                        THEN ip.company_currency_amount
                        ELSE 0 END) AS Received,
            
         SUM(CASE WHEN (ip.payment_date >= startdate 
                       AND ip.payment_date <= enddate)
                       AND ip.status = 'Bad Debt'
                       THEN ip.invoice_currency_amount
                       ELSE 0 END) AS BadDebt,
          
          SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        THEN ip.tds
                        ELSE 0 END) AS TDS
FROM invoice_payments AS ip              
INNER JOIN invoices AS i ON ip.invoice_id = i.id
AND company_id = companyID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getClientBill` (IN `startdate` DATE, IN `enddate` DATE, IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), INOUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SELECT SUM(ii.subtotal) AS LifeTime,  
       SUM(CASE WHEN i.invoice_date BETWEEN startdate AND enddate
         THEN ii.subtotal ELSE 0 
         END) AS ThisYear,
       SUM(CASE WHEN 
        i.invoice_date BETWEEN  date_sub(startdate,INTERVAL 1 year)
        AND date_sub(enddate,INTERVAL 1 year)                          
        THEN ii.subtotal ELSE 0 
        END) AS LastYear,
        SUM(CASE WHEN (MONTH(i.invoice_date) = MONTH(CURDATE()) AND (YEAR(i.invoice_date) = YEAR(CURDATE())))
            THEN ii.subtotal ELSE 0
            END) AS ThisMonth,
       SUM(CASE WHEN 
           (MONTH(i.invoice_date) = MONTH(date_sub(NOW(),INTERVAL 1 MONTH)) AND
           (YEAR(i.invoice_date) = YEAR(date_sub(now(),INTERVAL 1 MONTH))))
           THEN ii.subtotal ELSE 0
          END) AS LastMonth,
        c.client_name,
       c.company_name AS client_company_name,
       c.enroll_date AS Enrollment_date
FROM invoices AS i
INNER JOIN invoice_items AS ii ON i.id = ii.invoice_id
INNER JOIN clients AS c ON ii.client_id = c.id
WHERE (c.client_name LIKE CONCAT('%',search ,'%')
  OR c.company_name LIKE CONCAT('%',search ,'%'))
GROUP BY ii.client_id
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

SELECT COUNT(ii.subtotal) AS TotalRows
FROM invoices AS i
INNER JOIN invoice_items AS ii ON i.id = ii.invoice_id
INNER JOIN clients AS c ON ii.client_id = c.id
WHERE (c.client_name LIKE CONCAT('%',search ,'%')
  OR c.company_name LIKE CONCAT('%',search ,'%'))
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getClientGroupRevenue` (IN `subscriberID` INT, IN `startdate` DATE, IN `enddate` DATE)   BEGIN
SELECT cg.id,
       cg.group_name,
       SUM(i.total_tax_amount) AS Tax,
       SUM(i.subtotal) AS Net,
       SUM(i.invoice_currency_total_amount) AS TotalBill
FROM client_groups AS cg
JOIN clients AS c ON cg.id = c.client_group_id
JOIN invoices AS i ON c.id = i.client_id
WHERE (invoice_date >= startDate
      AND invoice_date <= endDate)
 AND cg.subscriber_id = subscriberID
 GROUP BY c.client_group_id;      
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getClientsWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = 0 THEN
            SELECT *
            FROM clients 
            WHERE client_name LIKE CONCAT('%',search, '%')
            OR company_name LIKE CONCAT('%',search, '%')
            OR email LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            OR status = search
            AND subscriber_id IS NULL
            OR subscriberId IS NULL
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            ELSE
          	 SELECT *
            FROM clients
            WHERE client_name LIKE CONCAT('%',search, '%')
            OR company_name LIKE CONCAT('%',search, '%')
            OR email LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            OR status = search
            AND subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM clients;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getClient_GroupsWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = 0 THEN
            SELECT cg.id
                  ,cg.Subscriber_id
                  ,s.official_name
                  ,cg.group_name
                  ,cg.description
                  ,cg.status
                  ,cg.created_by
                  ,cg.updated_by
                  ,cg.created_at
                  ,cg.updated_at
            FROM client_groups AS cg
            INNER JOIN subscribers AS s ON cg.subscriber_id = s.id
            INNER JOIN users AS u ON cg.created_by = u.id
            INNER JOIN users AS us ON cg.updated_by = us.id
            WHERE group_name LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            AND cg.subscriber_id IS NULL
            OR subscriberId IS NULL
             OR cg.status = search
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT cg.id
                  ,cg. Subscriber_id
                  ,s.official_name
                  ,cg.group_name
                  ,cg.description
                  ,cg.status
                  ,cg.created_by
                  ,cg.updated_by
                  ,cg.created_at
                  ,cg.updated_at
            FROM client_groups AS cg
            INNER JOIN subscribers AS s ON cg.subscriber_id = s.id
            INNER JOIN users AS u ON cg.created_by = u.id
            INNER JOIN users AS us ON cg.updated_by = us.id
            WHERE group_name LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            AND cg.subscriber_id IS NULL
            OR subscriberId IS NULL
            OR cg.status = search
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM client_groups;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCompaniesWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `OrderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = 0 THEN
            SELECT com.id
                  ,com.subscriber_id
                  ,s.official_name
                  ,com.company_name
                  ,com.trading_name
                  ,com.email
                  ,com.contact_number
                  ,com.website
                  ,com.registration_no
                  ,com.enroll_date
                  ,com.tax_no
                  ,com.gst_vat_no
                  ,com.currency_id 
                  ,cu.currency_name
                  ,com.address_1
                  ,com.address_2
                  ,com.city
                  ,com.state
                  ,com.zip_code
                  ,com.country_id 
                  ,co.country_name
                  ,com.status
                  ,com.created_by 
                  ,com.updated_by 
                  ,com.created_at
                  ,com.updated_at
            FROM companies AS com
            INNER JOIN subscribers AS s ON com.subscriber_id = s.id
            INNER JOIN currencies AS cu ON com.currency_id = cu.id
            INNER JOIN countries AS co ON com.currency_id = co.id
            INNER JOIN users AS u on com.created_by = u.id
            INNER JOIN users AS us on com.updated_by = us.id
            WHERE com.company_name LIKE CONCAT('%',search, '%')
            OR com.email LIKE CONCAT('%',search, '%')
            OR com.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            OR search = com.status
            AND com.subscriber_id IS NULL
            OR subscriberId IS NULL
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT com.id
                  ,com.subscriber_id
                  ,s.official_name
                  ,com.company_name
                  ,com.trading_name
                  ,com.email
                  ,com.contact_number
                  ,com.website
                  ,com.registration_no
                  ,com.enroll_date
                  ,com.tax_no
                  ,com.gst_vat_no
                  ,com.currency_id 
                  ,cu.currency_name
                  ,com.address_1
                  ,com.address_2
                  ,com.city
                  ,com.state
                  ,com.zip_code
                  ,com.country_id 
                  ,co.country_name
                  ,com.status
                  ,com.created_by 
                  ,com.updated_by 
                  ,com.created_at
                  ,com.updated_at
            FROM companies AS com
            INNER JOIN subscribers AS s ON com.subscriber_id = s.id
            INNER JOIN currencies AS cu ON com.currency_id = cu.id
            INNER JOIN countries AS co ON com.currency_id = co.id
            INNER JOIN users AS u on com.created_by = u.id
            INNER JOIN users AS us on com.updated_by = us.id
            WHERE com.company_name LIKE CONCAT('%',search, '%')
            OR com.email LIKE CONCAT('%',search, '%')
            OR com.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE ''
            OR search = com.status
            AND com.subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM companies;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCompany_ClientsByClientID` (IN `clientID` INT)   BEGIN

SELECT cc.id
      ,cc.company_id
      ,com.company_name
      ,cc.client_id
FROM company_clients AS cc
INNER JOIN companies AS com ON cc.company_id = com.id
WHERE cc.client_id = clientID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCompany_ClientsWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displaylength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;

            SELECT  cc.id
                   ,cc.company_id 
                   ,com.company_name
                   ,cc.client_id 
                   ,c.client_name
                   ,cc.created_by
                   ,cc.updated_by 
                   ,cc.created_at
                   ,cc.updated_at
            FROM company_clients AS cc
            INNER JOIN companies AS com ON cc.company_id = com.id
            INNER JOIN clients AS c ON cc.client_id = c.id
            INNER JOIN users AS u ON cc.created_by = u.id
            LEFT JOIN users AS us ON cc.updated_by = us.id
            WHERE (com.company_name LIKE CONCAT('%', search, '%')
            OR c.client_name LIKE CONCAT('%', search, '%')
            OR ifnull(search,'') LIKE '')

            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            
SELECT COUNT(*) AS TotalRow FROM company_clients;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getcompany_Financial_YearsWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;

            SELECT cfy.id 
                  ,cfy.subscriber_id
                  ,s.official_name
                  ,cfy.company_id
                  ,com.company_name
                  ,cfy.financial_year_name
                  ,cfy.start_date
                  ,cfy.end_date
                  ,cfy.is_default
                  ,cfy.created_by 
                  ,cfy.updated_by 
                  ,cfy.created_at
                  ,cfy.updated_at
            FROM company_financial_years AS cfy
            INNER JOIN subscribers AS s ON cfy.subscriber_id = s.id
            INNER JOIN companies AS com ON cfy.company_id = com.id
            INNER JOIN users AS u ON cfy.created_by = u.id
            LEFT JOIN users AS us ON cfy.updated_by = us.id
            WHERE (s.official_name LIKE CONCAT('%', search, '%')
            OR cfy.financial_year_name LIKE CONCAT('%', search, '%')
            OR ifnull(search,'') LIKE '')

            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            
SELECT COUNT(*) AS TotalRow FROM company_financial_years;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCompany_UsersWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;

SELECT cu.id 
      ,cu.company_id 
      ,com.company_name
      ,cu.user_id
      ,u.first_name
      ,u.last_name
      ,cu.is_default
      ,cu.created_by
      ,cu.updated_by 
      ,cu.created_at
      ,cu.updated_at
FROM company_users AS cu
INNER JOIN companies AS com ON cu.company_id = com.id
INNER JOIN users AS u ON cu.user_id = u.id
INNER JOIN users as us ON cu.created_by = us.id
LEFT JOIN users AS usr ON cu.updated_by = usr.id
WHERE (com.company_name LIKE CONCAT('%', search, '%')
OR u.first_name LIKE CONCAT('%', search, '%')
OR u.last_name LIKE CONCAT('%', search, '%')
OR ifnull(search,'')LIKE '');

SELECT COUNT(id) AS TotalRows FROM company_users;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCompany_UsersWithUserID` (IN `userID` INT)   BEGIN
SELECT cu.id
      ,cu.company_id
      ,com.company_name
      ,cu.user_id
FROM company_users AS cu
INNER JOIN companies AS com ON cu.company_id = com.id
WHERE cu.user_id = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCountriesWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(255), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
SELECT * FROM countries
WHERE country_name  LIKE CONCAT('%',search, '%')
OR ifnull(search,'') LIKE ''
OR status = search
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET  displayStart;

SELECT COUNT(*) AS TotalRows FROM countries;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCountry_TaxesWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;

SELECT ct.id
      ,ct.country_id
      ,co.country_name
      ,ct.tax_name
      ,ct.rate
      ,ct.is_percentage
      ,ct.status
      ,ct.created_by
      ,ct.updated_by
      ,ct.created_at
      ,ct.updated_at
FROM  country_taxes AS ct
INNER JOIN countries AS co ON ct.country_id = co.id
INNER JOIN users AS u ON ct.created_by = u.id
LEFT JOIN users AS us ON ct.updated_by = us.id
WHERE tax_name LIKE CONCAT('%', search , '%')
OR ifnull(search,'') LIKE ''
OR ct.status = search
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

SELECT COUNT(*) AS TotalRows FROM country_taxes;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCurrenciesWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
SELECT * FROM currencies
WHERE currency_name LIKE CONCAT('%',search, '%')
OR short_code LIKE CONCAT('%',search,'%')
OR ifnull(search,'') LIKE ''
OR status = search
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

SELECT COUNT(*) AS TotalRows FROM currencies;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getDashboardCard` (IN `startdate` DATE, IN `enddate` DATE, IN `companyID` INT, IN `subscriberID` INT, IN `isSubscriber` INT)   BEGIN
IF isSubscriber = 1 THEN
SELECT COUNT(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.id
                     END) AS InvoiceCount,
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.invoice_currency_total_amount
                     ELSE 0 END) AS TotalSales,
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.total_tax_amount
                     ELSE 0 END)  AS TotalTax, 
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.subtotal
                     ELSE 0 END ) AS SubTotal,
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     AND i.invoice_status != 'Bad Debt'
                     AND i.invoice_status != 'Paid'
                     THEN i.total_remaining_amount
                     ELSE 0 END) AS Due,
                     
       SUM(CASE WHEN (i.invoice_date >= date_sub(startdate,INTERVAL 1 YEAR)              
                     AND i.invoice_date <= date_sub(enddate,INTERVAL 1 YEAR))
                     AND i.invoice_status != 'Bad Debt'
                     AND i.invoice_status != 'Paid'
                     THEN i.total_remaining_amount
                     ELSE 0 END) AS PreviousYear              
FROM invoices AS i
WHERE i.subscriber_id = subscriberID;

      SELECT  SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        AND ip.status != 'Bad Debt'
                        THEN ip.company_currency_amount
                        ELSE 0 END) AS Received,

         SUM(CASE WHEN (ip.payment_date >= startdate 
                       AND ip.payment_date <= enddate)
                       AND ip.status = 'Bad Debt'
                       THEN ip.invoice_currency_amount
                       ELSE 0 END) AS BadDebt,
          
          SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        THEN ip.tds
                        ELSE 0 END) AS TDS
FROM invoice_payments AS ip              
INNER JOIN invoices AS i ON ip.invoice_id = i.id
WHERE i.subscriber_id = subscriberID;



ELSE  


SELECT COUNT(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.id
                     END) AS InvoiceCount,
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.invoice_currency_total_amount
                     ELSE 0 END) AS TotalSales,
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.total_tax_amount
                     ELSE 0 END)  AS TotalTax, 
       SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     THEN i.subtotal
                     ELSE 0 END ) AS SubTotal,
            SUM(CASE WHEN (i.invoice_date >= startdate
                     AND i.invoice_date <= enddate)
                     AND i.invoice_status NOT IN ('Bad Debt','Paid')
                     THEN i.total_difference
                     ELSE 0 END) AS Due,
                     
       SUM(CASE WHEN (i.invoice_date BETWEEN date_sub(startdate,INTERVAL 1 YEAR)              
                     AND date_sub(enddate,INTERVAL 1 YEAR))
                     AND i.invoice_status NOT IN ('Bad Debt','Paid')
                     THEN i.total_difference
                     ELSE 0 END) AS PreviousYear               
FROM invoices AS i                     
WHERE FIND_IN_SET(i.company_id,CompanyID);
     
      
      
      SELECT  SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        AND ip.status != 'Bad Debt'
                        THEN ip.company_currency_amount
                        ELSE 0 END) AS Received,
            
         SUM(CASE WHEN (ip.payment_date >= startdate 
                       AND ip.payment_date <= enddate)
                       AND ip.status = 'Bad Debt'
                       THEN ip.invoice_currency_amount
                       ELSE 0 END) AS BadDebt,
          
          SUM(CASE WHEN (ip.payment_date >= startdate
                        AND ip.payment_date <= enddate)
                        THEN ip.tds
                        ELSE 0 END) AS TDS
                        
FROM invoice_payments AS ip              
INNER JOIN invoices AS i ON ip.invoice_id = i.id
AND i.company_id = companyID;
END IF;      

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getDashboard_Card_2` (IN `startdate` DATE, IN `enddate` DATE, IN `companyID` VARCHAR(50), IN `subscriberID` INT, IN `isSubscriber` INT)   BEGIN
IF isSubscriber = 1 THEN
SELECT  SUM(CASE WHEN (i.invoice_date BETWEEN startdate AND enddate)
            AND ip.Status != 'Bad Dept'
            THEN ip.invoice_currency_amount 
            ELSE 0 END) AS Received,
            
        SUM(CASE WHEN i.invoice_date BETWEEN startdate AND enddate
           THEN ip.tds 
           ELSE 0 END) AS TDS,
           
       SUM(CASE WHEN (i.invoice_date BETWEEN startdate AND enddate)
           AND ip.status = 'Bad Debt'
           THEN ip.invoice_currency_amount
           ELSE 0 END) AS BadDebt
       
FROM invoices AS i
INNER JOIN invoice_payments AS ip ON i.id = ip.invoice_id
WHERE i.subscriber_id = subscriberID;

ELSE

SELECT  SUM(CASE WHEN (i.invoice_date BETWEEN startdate AND enddate)
            AND ip.Status != 'Bad Dept'
            THEN ip.invoice_currency_amount 
            ELSE 0 END) AS Received,
            
        SUM(CASE WHEN i.invoice_date BETWEEN startdate AND enddate
           THEN ip.tds 
           ELSE 0 END) AS TDS,
           
       SUM(CASE WHEN (i.invoice_date BETWEEN startdate AND enddate)
           AND ip.status = 'Bad Debt'
           THEN ip.invoice_currency_amount
           ELSE 0 END) AS BadDebt
  
FROM invoices AS i
INNER JOIN invoice_payments AS ip ON i.id = ip.invoice_id
WHERE FIND_IN_SET(i.company_id,CompanyID)
AND i.company_id = companyID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDemoAarti` (IN `CompanyID` INT)   BEGIN

SELECT `currencies`.*, SUM(CASE WHEN(expenses.date BETWEEN '2022-04-01' AND '2023-03-31') THEN expenses.amount ELSE 0 END) AS `total`
FROM `expenses`
left JOIN `companies` ON `companies`.`id`=`expenses`.`company_id`
LEFT JOIN `currencies` ON `currencies`.`id`=`companies`.`currency_id`
WHERE `companies`.`id` = 5
GROUP BY `expenses`.`subscriber_id`;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getGroupViseClient` (IN `clientID` INT, IN `startdate` DATE, IN `enddate` DATE)   BEGIN
SELECT c.id,
       c.client_name,
       SUM(it.total_tax_amount) AS TotalTax,
        SUM(it.subtotal) AS SubTotal,
        SUM(it.invoice_currency_total_amount) AS TotalSales
FROM invoices  AS it
JOIN clients AS c ON it.client_id = c.id
WHERE (invoice_date >= startDate
      AND invoice_date <= endDate)
 AND it.client_id = clientID
 group by c.id;     
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getInvoiceCount` (IN `startDate` DATE, IN `endDate` DATE, IN `companyID` INT, IN `subscriberID` INT)   BEGIN
IF companyID = 0 THEN
SELECT COUNT(id) AS InvoiceCount,
       SUM(invoice_currency_total_amount) AS TotalSales,
       SUM(total_tax_amount) AS TotalTax,
       SUM(subtotal) AS SubTotal
FROM invoices 
WHERE (invoice_date >= startDate
      AND invoice_datee <= endDate) 
      AND subscriber_id = subscriberID;
ELSE  
SELECT COUNT(id) AS InvoiceCount,
       SUM(invoice_currency_total_amount) AS TotalSales,
       SUM(total_tax_amount) AS TotalTax,
       SUM(subtotal) AS SubTotal
FROM invoices AS i
WHERE (invoice_date >= startDate
      AND invoice_date <= endDate)
      AND company_id = companyID;
END IF;      
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getinvoice_item_typesWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100), IN `subscriberID` VARCHAR(255))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT iit.id
                  ,iit.subscriber_id
                  ,s.official_name
                  ,iit.item_type_name
                  ,iit.is_date
                  ,iit.date_type
                  ,iit.date_no 
                  ,iit.status
                  ,iit.created_by
                  ,iit.updated_by
                  ,iit.created_at
                  ,iit.updated_at
            FROM invoice_item_types AS iit
            INNER JOIN subscribers AS s ON iit.subscriber_id = s.id
            INNER JOIN users AS u ON iit.created_by = u.id
            LEFT JOIN users AS us ON iit.updated_by = us.id 
            WHERE (item_type_name LIKE CONCAT('%',search, '%')
            OR  iit.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '')
            
            AND iit.subscriber_id IS NULL
            OR subscriberId IS NULL
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT iit.id
                  ,iit.subscriber_id
                  ,s.official_name
                  ,iit.item_type_name
                  ,iit.is_date
                  ,iit.date_type
                  ,iit.date_no 
                  ,iit.status
                  ,iit.created_by
                  ,iit.updated_by
                  ,iit.created_at
                  ,iit.updated_at
            FROM invoice_item_types AS iit
            INNER JOIN subscribers AS s ON iit.subscriber_id = s.id
            INNER JOIN users AS u ON iit.created_by = u.id
            LEFT JOIN users AS us ON iit.updated_by = us.id 
            WHERE (item_type_name LIKE CONCAT('%',search, '%')
            OR  iit.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '')
            
            AND iit.subscriber_id = subscriberID
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM invoice_item_types;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getMonthlyInvoiceRevenue` (IN `startdate` DATE, IN `enddate` DATE)   BEGIN

SELECT 
      concat_ws(' - ',left(MONTHNAME(NOW()),3),YEAR(startdate)) AS Month,
       SUM(total_tax_amount) AS Tax,
       SUM(subtotal) AS Net,
       SUM(invoice_currency_total_amount) AS TotalBill
FROM invoices;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getMonthWiseInvoice` (IN `startdate` DATE, IN `enddate` DATE)   BEGIN
CREATE TEMPORARY TABLE demoName
select 
DATE_FORMAT(m1, '%b - %Y') AS MonthName
from
(
select 
(startdate - INTERVAL DAYOFMONTH(startdate)-1 DAY) 
+ INTERVAL m MONTH as m1
from
(
select @rownum:=@rownum + 1 as m from
(select 1 union select 2 union select 3 union select 4) t1,
(select 1 union select 2 union select 3 union select 4) t2,
(select 1 union select 2 union select 3 union select 4) t3,
(select 1 union select 2 union select 3 union select 4) t4,
(select @rownum:=-1) t0
) d1
) d2 
where m1 <= enddate
ORDER BY m1;
select SUM(CASE WHEN (invoices.invoice_date >= DATE_FORMAT(demoname.MonthName, '%Y-%m')
           AND invoices.invoice_date <= DATE_FORMAT(demoname.MonthName, '%Y-%m'))
          THEN (invoices.currency_conversion_rate) ELSE 0 END) AS abc
from demoName,invoices;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getPayment_sourcesWithPagination` (IN `SubscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT ps.id
                  ,ps.subscriber_id
                  ,s.official_name
                  ,ps.payment_source_name
                  ,ps.status
                  ,ps.created_by
                  ,ps.updated_by
                  ,ps.created_at
                  ,ps.updated_at
            FROM payment_sources AS ps
            INNER JOIN subscribers AS s ON ps.subscriber_id = s.id
            INNER JOIN users AS u ON ps.created_by = u.id
            LEFT JOIN users AS us ON ps.updated_by = us.id
            WHERE (payment_source_name LIKE CONCAT('%',search, '%')
            OR ps.status LIKE CONCAT('%',search, '%'))
            OR( ps.subscriber_id IS NULL
            OR ifnull(search,'') LIKE '')
            
            
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT ps.id
                  ,ps.subscriber_id
                  ,s.official_name
                  ,ps.payment_source_name
                  ,ps.status
                  ,ps.created_by
                  ,ps.updated_by
                  ,ps.created_at
                  ,ps.updated_at
            FROM payment_sources AS ps
            INNER JOIN subscribers AS s ON ps.subscriber_id = s.id
            INNER JOIN users AS u ON ps.created_by = u.id
            LEFT JOIN users AS us ON ps.updated_by = us.id
            WHERE 
            (payment_source_name LIKE CONCAT('%',search, '%')
            OR ps.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '')
            AND (ps.subscriber_id = subscriberId)
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM payment_sources;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getPermissionsWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(255), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
 SELECT * FROM permissions
 WHERE name LIKE CONCAT('%',search, '%')
 OR url LIKE CONCAT('%',search,'%')
 OR ifnull(search,'') LIKE ''
ORDER BY (orderColumn), orderDir
 limit  displayLength
 OFFSET  displayStart;
 
 SELECT COUNT(*) AS TotalRow from permissions;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getPermission_GroupWithPagination` (IN `subscriberId` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100), IN `search` VARCHAR(255))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT pg.id
                  ,pg.name
                  ,pg.description
                  ,pg.permissions
                  ,pg.restrictions
                  ,pg.subscriber_id
                  ,s.official_name
                  ,pg.created_at
                  ,pg.updated_at
            FROM permission_group AS pg
            LEFT JOIN subscribers AS s ON pg.subscriber_id = s.id
            WHERE (name LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '')
            
            AND pg.subscriber_id IS NULL
            
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT pg.id
                  ,pg.name
                  ,pg.description
                  ,pg.permissions
                  ,pg.restrictions
                  ,pg.subscriber_id
                  ,s.official_name
                  ,pg.created_at
                  ,pg.updated_at
            FROM permission_group AS pg
            INNER JOIN subscribers AS s ON pg.subscriber_id = s.id
            WHERE (name LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '' )
     
            AND pg.subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM permission_group;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getReceived` (IN `startdate` DATE, IN `enddate` DATE)   BEGIN
Select SUM(ip.invoice_currency_amount) AS Received
FROM invoice_payments AS ip
INNER JOIN invoices AS i ON ip.invoice_id = i.id
WHERE ip.Status != 'Bad Dept'
AND (i.invoice_date >= startdate
AND i.invoice_date <= enddate);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRestrictionsWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(255), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
SELECT r.id
      ,r.permission_id 
      ,p.name as permission_name
      ,r.name
      ,r.slug 
      ,r.description
      ,r.created_at
      ,r.updated_at
FROM restrictions AS r
INNER JOIN permissions AS p ON r.permission_id = p.id
WHERE r.name LIKE CONCAT('%',search, '%')
OR ifnull(search,'') LIKE ''
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

SELECT COUNT(*) AS TotalRows FROM restrictions;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRoleWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT r.id
                  ,r.name
                  ,r.group_id
                  ,pg.name AS permission_group_name
                  ,r.subscriber_id
                  ,s.official_name
                  ,r.can_delete
                  ,r.status
                  ,r.created_at
                  ,r.updated_at
            FROM role AS r
            LEFT JOIN subscribers AS s on r.subscriber_id = s.id
            INNER JOIN permission_group AS pg ON r.group_id = pg.id
            WHERE (r.name LIKE CONCAT('%' ,search , '%')
            OR r.status LIKE CONCAT('%' ,search , '%'))
            
            AND (r.subscriber_id IS NULL
            OR subscriberId IS NULL)
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            ELSE
          	 SELECT r.id
                  ,r.name
                  ,r.group_id
                  ,pg.name AS permission_group_name
                  ,r.subscriber_id
                  ,s.official_name
                  ,r.can_delete
                  ,r.status
                  ,r.created_at
                  ,r.updated_at
            FROM role AS r
            LEFT JOIN subscribers AS s on r.subscriber_id = s.id
            INNER JOIN permission_group AS pg ON r.group_id = pg.id
            WHERE (r.name LIKE CONCAT('%',search,'%')
            OR r.status LIKE CONCAT('%',search,'%')
            OR ifnull(search,'') LIKE '' )
            AND r.subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM role;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getSource_PlatformsWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT sp.id
                  ,sp.subscriber_id
                  ,s.official_name
                  ,sp.platform_name
                  ,sp.status
                  ,sp.created_by
                  ,sp.updated_by
                  ,sp.created_at
                  ,sp.updated_at
            FROM source_platforms AS sp
            INNER JOIN subscribers AS s ON sp.subscriber_id = s.id
            INNER JOIN users AS u ON sp.created_by = u.id
            LEFT JOIN users AS us ON sp.updated_by = us.id
            WHERE (sp.platform_name LIKE CONCAT('%', search, '%')
            OR sp.status LIKE CONCAT('%', search, '%'))
            
            OR (sp.subscriber_id IS NULL
            OR subscriberId IS NULL)
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            
            ELSE
            
          	 SELECT sp.id
                  ,sp.subscriber_id
                  ,s.official_name
                  ,sp.platform_name
                  ,sp.status
                  ,sp.created_by
                  ,sp.updated_by
                  ,sp.created_at
                  ,sp.updated_at
            FROM source_platforms AS sp
            INNER JOIN subscribers AS s ON sp.subscriber_id = s.id
            INNER JOIN users AS u ON sp.created_by = u.id
            LEFT JOIN users AS us ON sp.updated_by = us.id
            WHERE (sp.platform_name LIKE CONCAT('%',search, '%')
            OR sp.status LIKE CONCAT('%',search, '%')
            OR ifnull(search,'') LIKE '')
            
            AND sp.subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM source_platforms;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getSubscribersWithPagination` (IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
SELECT s.id
      ,s.official_name
      ,s.first_name
      ,s.last_name
      ,s.email
      ,s.phone
      ,s.address_1
      ,s.address_2
      ,s.city
      ,s.state
      ,s.zipcode
      ,s.country_id
      ,c.country_name
      ,s.status
      ,s.created_at
      ,s.updated_at
FROM subscribers AS s
INNER JOIN countries AS c ON s.country_id = c.id
WHERE s.official_name LIKE CONCAT('%', search, '%')
OR s.email LIKE CONCAT('%', search, '%')
OR s.phone LIKE CONCAT('%', search, '%')
OR ifnull(search,'') LIKE ''
OR s.status LIKE CONCAT('%', search, '%')
ORDER BY (orderColumn), orderDir
LIMIT displayLength
OFFSET displayStart;

SELECT COUNT(*) AS TotalRows FROM subscribers;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTds` (IN `startdate` DATE, IN `enddate` DATE)   BEGIN
SELECT SUM(ip.tds) TDS
FROM invoice_payments AS ip
INNER JOIN invoices AS i ON ip.invoice_id = i.id
WHERE (i.invoice_date >= startdate
AND i.invoice_date <= enddate);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsersWithPagination` (IN `subscriberID` VARCHAR(255), IN `search` VARCHAR(255), IN `orderColumn` VARCHAR(100), OUT `displayLength` INT, IN `displayStart` INT, IN `orderDir` VARCHAR(100))   BEGIN
SET displayLength := 5;
		IF subscriberId = '' THEN
            SELECT u.id
                  ,u.subscriber_id
                  ,s.official_name
                  ,u.first_name
                  ,u.last_name
                  ,u.username
                  ,u.email
                  ,u.password
                  ,u.phone
                  ,u.user_type
                  ,u.role_id
                  ,r.name AS role_name
                  ,u.status
                  ,u.created_by
                  ,u.updated_by
                  ,u.created_at
                  ,u.updated_at
            FROM users AS u
            LEFT JOIN subscribers AS s ON u.subscriber_id = s.id
            INNER JOIN role AS r ON u.role_id = r.id
            LEFT JOIN users AS us ON u.created_by = us.id
            LEFT JOIN users AS usr ON u.updated_by = usr.id
            WHERE (u.first_name LIKE CONCAT('%',search, '%')
            OR u.last_name LIKE CONCAT('%',search, '%')
            OR 	u.email LIKE CONCAT('%',search, '%')
            OR u.status LIKE CONCAT('%',search, '%'))
            
            AND (u.subscriber_id IS NULL
            OR subscriberId IS NULL)
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            ELSE
          	SELECT u.id
                  ,u.subscriber_id
                  ,s.official_name
                  ,u.first_name
                  ,u.last_name
                  ,u.username
                  ,u.email
                  ,u.password
                  ,u.phone
                  ,u.user_type
                  ,u.role_id
                  ,r.name AS role_name
                  ,u.status
                  ,u.created_by
                  ,u.updated_by
                  ,u.created_at
                  ,u.updated_at
            FROM users AS u 
            LEFT JOIN subscribers AS s ON u.subscriber_id = s.id
            INNER JOIN role AS r ON u.role_id = r.id
            LEFT JOIN users AS us ON u.created_by = us.id
            LEFT JOIN users AS usr ON u.updated_by = usr.id
            WHERE (u.first_name LIKE CONCAT('%',search, '%')
            OR u.last_name LIKE CONCAT('%',search, '%')
            OR u.email LIKE CONCAT('%',search, '%')
            OR u.status LIKE CONCAT('%',search, '%'))
            AND u.subscriber_id = subscriberId
            ORDER BY (orderColumn), orderDir
            LIMIT displayLength
            OFFSET displayStart;
            END IF;
SELECT COUNT(*) AS TotalRow FROM users;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `invoice_item_types_CRUD` (IN `invoiceItemID` INT, IN `subscriberID` INT, IN `itemTypeName` VARCHAR(100), IN `isDate` ENUM('Yes','No'), IN `dateType` ENUM('days','months','years'), IN `dateNo` INT, IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO invoice_item_types
(subscriber_id 
 ,item_type_name
 ,is_date
 ,date_type
 ,date_no
 ,status
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
(subscriberID
 ,itemTypeName
 ,isDate
 ,dateType
 ,dateNo
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE invoice_item_types 
SET
  subscriber_id = subscriberID
 ,item_type_name = itemTypeName
 ,is_date = isDate
 ,date_type = dateType
 ,date_no = dateNo
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = invoiceItemID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM invoice_item_types
 WHERE id = invoiceItemID;
 END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_Sources_CRUD` (IN `paymentSourceID` INT, IN `subscriberID` INT, IN `paymentSourceName` VARCHAR(100), IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO payment_sources
( subscriber_id 
 ,payment_source_name
 ,status
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
( subscriberID
 ,paymentSourceName
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE payment_sources
SET
  subscriber_id = subscriberID
 ,payment_source_name = paymentSourceName
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = paymentSourceID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM payment_sources
 WHERE id = paymentSourceID;
 END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `permissions_CRUD` (IN `permissionID` INT, IN `name` VARCHAR(100), IN `slug` VARCHAR(100), IN `url` VARCHAR(255), IN `isDefault` ENUM('Yes','No'), IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO permissions
( name
 ,slug 
 ,url 
 ,is_default
)
VALUES
( name
 ,slug
 ,url
 ,isDefault
);
END IF;

IF action = 'Update' THEN
UPDATE permissions
SET
  name = name
 ,slug = slug
 ,url = url
 ,is_default = isDefault
 WHERE id = permissionID;
 END IF;
 
IF action = 'Delete' THEN
DELETE FROM permissions
WHERE id = permissionID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `permissions_Group_CRUD` (IN `permissionGroupID` INT, IN `name` VARCHAR(100), IN `description` TEXT, IN `permissions` TEXT, IN `restrictions` TEXT, IN `subscriberID` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO permission_group
( name
 ,description
 ,permissions
 ,restrictions
 ,subscriber_id 
 ,created_at
 ,updated_at
)
VALUES
( name
 ,description
 ,permissions
 ,restrictions
 ,subscriberID
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE permission_group
SET
  name  = name
 ,description = description
 ,permissions = permissions 
 ,restrictions = restrictions
 ,subscriber_id = subscriberID
 ,created_at = createdAt
 ,updated_at = updatedAt
WHERE id = permissionGroupID;
END IF;

IF action = 'Delete' THEN
DELETE FROM permission_group
WHERE id = permissionGroupID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `restrictions_CRUD` (IN `restrictionID` INT, IN `permissionID` INT, IN `name` VARCHAR(100), IN `slug` VARCHAR(100), IN `description` TEXT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO restrictions
( permission_id 
 ,name
 ,slug 
 ,description
 ,created_at
 ,updated_at
)
VALUES
( permissionID
 ,name
 ,slug
 ,description
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE restrictions
SET
  permission_id = permissionID
 ,name = name
 ,slug = slug
 ,description = description
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = restrictionID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM restrictions
 WHERE id = restrictionID;
 END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `role_CRUD` (IN `roleID` INT, IN `name` VARCHAR(100), IN `groupID` INT, IN `subscriberID ` INT, IN `canDelete` ENUM('Yes','No'), IN `status` ENUM('Active','Inactive'), IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO role
( name
 ,group_id 
 ,subscriber_id 
 ,can_delete
 ,status
 ,created_at
 ,updated_at
)
VALUES
( name
 ,groupID
 ,subscriberID 
 ,canDelete
 ,status
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE role
SET
  name = name
 ,group_id = groupID
 ,subscriber_id = subscriberID
 ,can_delete = canDelete
 ,status =- status
 ,created_at = createdAt
 ,updated_at = updatedAt
WHERE id = roleID;
END IF;

IF action = 'Delete' THEN
DELETE FROM role
WHERE id = roleID;
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `source_Platforms_CRUD` (IN `sourcePlatformID` INT, IN `subscriberID` INT, IN `platformName` VARCHAR(100), IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO source_platforms
( subscriber_id 
 ,platform_name
 ,status
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
( subscriberID
 ,platformName
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF ACTION = 'Update' THEN
UPDATE source_platforms
SET
  subscriber_id = subscriberID
 ,platform_name = platformName
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = sourcePlatformID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM source_platforms
 WHERE id = sourcePlatformID;
 END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DASHBOARD_CARD` (IN `CompanyID` VARCHAR(255), IN `SubscriberID` INT(11), IN `IsSubscriber` INT, IN `StartDate` DATE, IN `EndDate` DATE)   BEGIN

	IF IsSubscriber = 1 THEN
	
	   SELECT COUNT(CASE WHEN (i.invoice_date BETWEEN StartDate AND EndDate)
				THEN i.id END) AS InvoiceCount,
				
	   	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
	         THEN i.invoice_currency_total_amount ELSE 0 END) AS TotalSales,
	         
	     	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
	         THEN i.total_tax_amount ELSE 0 END)  AS TotalTax,
	         
	   	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate) 
		  		THEN i.subtotal ELSE 0 END ) AS SubTotal,
		  		
			SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
				AND i.invoice_status != 'Paid' AND i.invoice_status != 'Bed Debt'
		  		THEN i.total_remaining_amount ELSE 0 END ) AS Due,

			SUM(CASE WHEN (i.invoice_date >= DATE_SUB(StartDate, INTERVAL 1 YEAR) AND i.invoice_date <= DATE_SUB(EndDate, INTERVAL 1 YEAR))
				AND i.invoice_status != 'Paid' AND i.invoice_status != 'Bed Debt'
		  		THEN i.total_remaining_amount ELSE 0 END ) AS PreviousYearDue		  		
	   
		FROM `invoices` AS i    
	   WHERE i.subscriber_id = SubscriberID;
	   
	ELSE
	 
	   SELECT COUNT(CASE WHEN (i.invoice_date BETWEEN StartDate AND EndDate)
				THEN i.id END) AS InvoiceCount,
				
	   	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
	         THEN i.invoice_currency_total_amount ELSE 0 END) AS TotalSales,
	         
	     	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
	         THEN i.total_tax_amount ELSE 0 END)  AS TotalTax,
	         
	   	SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate) 
		  		THEN i.subtotal ELSE 0 END ) AS SubTotal,
		  		
			SUM(CASE WHEN (i.invoice_date >= StartDate AND i.invoice_date <= EndDate)
				AND i.invoice_status != 'Paid' AND i.invoice_status != 'Bed Debt'
		  		THEN i.total_remaining_amount ELSE 0 END ) AS Due,

			SUM(CASE WHEN (i.invoice_date >= DATE_SUB(StartDate, INTERVAL 1 YEAR) AND i.invoice_date <= DATE_SUB(EndDate, INTERVAL 1 YEAR))
				AND i.invoice_status != 'Paid' AND i.invoice_status != 'Bed Debt'
		  		THEN i.total_remaining_amount ELSE 0 END ) AS PreviousYearDue
		  		
	   FROM `invoices` AS i    
	   WHERE FIND_IN_SET(i.company_id,CompanyID); 
	
	END IF; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_DASHBOARD_CARD2` (IN `CompanyID` VARCHAR(255), IN `SubscriberID` INT(11), IN `IsSubscriber` INT(11), IN `StartDate` DATE, IN `EndDate` DATE)   BEGIN
	IF IsSubscriber = 1 THEN
	
		SELECT SUM(CASE WHEN (ip.payment_date BETWEEN StartDate AND EndDate)
		            AND ip.Status != 'Bad Dept'
		            THEN ip.invoice_currency_amount 
		            ELSE 0 END) AS Received,
		            
		        SUM(CASE WHEN ip.payment_date BETWEEN StartDate AND EndDate
		           THEN ip.tds 
		           ELSE 0 END) AS Tds,
		           
		       SUM(CASE WHEN (ip.payment_date BETWEEN StartDate AND EndDate)
		           AND ip.status = 'Bad Debt'
		           THEN ip.invoice_currency_amount
		           ELSE 0 END) AS BadDebt   
		           
		FROM invoices AS i
		INNER JOIN invoice_payments AS ip ON i.id = ip.invoice_id
		WHERE i.subscriber_id = SubscriberID;
		
	ELSE
	
		SELECT SUM(CASE WHEN (ip.payment_date BETWEEN StartDate AND EndDate)
			         AND ip.Status != 'Bad Dept'
			         THEN ip.invoice_currency_amount 
			         ELSE 0 END) AS Received,
	         	SUM(CASE WHEN ip.payment_date BETWEEN StartDate AND EndDate
		         	THEN ip.tds ELSE 0 END) AS Tds,
					SUM(CASE WHEN (ip.payment_date BETWEEN StartDate AND EndDate)
		         	AND ip.status = 'Bad Debt' 
						THEN ip.invoice_currency_amount ELSE 0 END) AS BadDebt 
						
		FROM invoices AS i
		INNER JOIN invoice_payments AS ip ON i.id = ip.invoice_id
		WHERE FIND_IN_SET(i.company_id,CompanyID)
		AND i.company_id = CompanyID;
		
	END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `subscribers_CRUD` (IN `subscriberID` INT, IN `officialName` VARCHAR(100), IN `firstName` VARCHAR(100), IN `lastName` VARCHAR(100), IN `email` VARCHAR(150), IN `phone` VARCHAR(20), IN `address1` VARCHAR(255), IN `address2` VARCHAR(255), IN `city` VARCHAR(100), IN `state` VARCHAR(100), IN `zipCode` VARCHAR(100), IN `countryID` INT, IN `status` ENUM('Active','Inactive'), IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO subscribers
( official_name
 ,first_name
 ,last_name
 ,email
 ,phone
 ,address_1
 ,address_2
 ,city
 ,state
 ,zipcode
 ,country_id 
 ,status
 ,created_at
 ,updated_at
)
VALUES 
( officialName
 ,firstName
 ,lastName
 ,email
 ,phone
 ,address1
 ,address2
 ,city
 ,state
 ,zipCode
 ,countryID
 ,status
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE subscribers
SET 
  official_name = officialName
 ,first_name = firstName
 ,last_name = lastName
 ,email = email
 ,phone = phone
 ,address_1 = address1
 ,address_2 = address2
 ,city = city
 ,state = state
 ,zipcode = zipCode
 ,country_id = countryID
 ,status = status
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = subscriberID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM subscribers
 WHERE id = subscriberID;
 END IF;
 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `testingMonth` (IN `startdate` DATE, IN `enddate` DATE)   select 
DATE_FORMAT(m1, '%b - %Y') AS MonthName
from
(
select 
(startdate - INTERVAL DAYOFMONTH(startdate)-1 DAY) 
+ INTERVAL m MONTH as m1
from
(
select @rownum:=@rownum + 1 as m from
(select 1 union select 2 union select 3 union select 4) t1,
(select 1 union select 2 union select 3 union select 4) t2,
(select 1 union select 2 union select 3 union select 4) t3,
(select 1 union select 2 union select 3 union select 4) t4,
(select @rownum:=-1) t0
) d1
) d2 
where m1 <= enddate
order by m1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `users_CRUD` (IN `userID` INT, IN `subscriberID` INT, IN `firstName` VARCHAR(100), IN `lastName` VARCHAR(100), IN `username` VARCHAR(100), IN `email` VARCHAR(150), IN `password` VARCHAR(255), IN `phone` VARCHAR(20), IN `userType` ENUM('SuperAdmin','Subscriber','Client','User'), IN `roleID` INT, IN `status` ENUM('Active','Inactive'), IN `createdBy` INT, IN `updatedBy` INT, IN `createdAt` DATETIME, IN `updatedAt` DATETIME, IN `action` VARCHAR(255))   BEGIN

IF action = 'Insert' THEN
INSERT INTO users
( subscriber_id 
 ,first_name
 ,last_name
 ,username
 ,email
 ,password
 ,phone
 ,user_type
 ,role_id 
 ,status
 ,created_by 
 ,updated_by 
 ,created_at
 ,updated_at
)
VALUES
( subscriberID
 ,firstName
 ,lastName
 ,username
 ,email
 ,password
 ,phone
 ,userType
 ,roleID
 ,status
 ,createdBy
 ,updatedBy
 ,createdAt
 ,updatedAt
);
END IF;

IF action = 'Update' THEN
UPDATE users
SET
  subscriber_id = subscriberID
 ,first_name = firstName
 ,last_name = lastName
 ,username = username
 ,email = email
 ,password = password
 ,phone = phone
 ,user_type = userType
 ,role_id = roleID
 ,status = status
 ,created_by = createdBy
 ,updated_by = updatedBy
 ,created_at = createdAt
 ,updated_at = updatedAt
 WHERE id = userID;
 END IF;
 
 IF action = 'Delete' THEN
 DELETE FROM users
 WHERE id = userID;
 END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `app_token`
--

CREATE TABLE `app_token` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `platform_name` varchar(100) DEFAULT NULL,
  `platform_agent` varchar(100) DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `type` enum('Login','Forgot') NOT NULL DEFAULT 'Login',
  `expired_at` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `app_token`
--

INSERT INTO `app_token` (`id`, `user_id`, `token`, `ip_address`, `device_type`, `platform_name`, `platform_agent`, `device_id`, `device_name`, `type`, `expired_at`, `created_at`, `updated_at`) VALUES
(2, 1, 'HICgUGBJedxfzLwr07pMhomTbFkjOPi6RlqS9YtWA8v4Zcun32', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664788335', '2022-10-03 14:37:15', NULL),
(4, 2, 'O9kdPsyiHl7ATYWe02axvuf56Ltcnwp3jIgVFRbSBrU8JmCqho', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664788574', '2022-10-03 14:41:14', NULL),
(9, 1, 'UJQi8fGZsMHq4w0IN5PdrLTDyO7EkKSVnF6vxRYAo3claeXb9m', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664788885', '2022-10-03 14:46:25', NULL),
(15, 1, '7LpPuoD2O1Q4CfZqny5EG0Bg3Um8WdrJN6xSlRFVHcIijYsMvT', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664790326', '2022-10-03 15:10:26', NULL),
(16, 1, 'YwoAvm7jikTStsaVldeFy9LXE2IbWGBx3u6g4cNqpr8J1zQZ0D', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664790327', '2022-10-03 15:10:27', NULL),
(17, 1, 'OZs6SXD7gkcqiJjmIT4VvrQaYRfpuWU2hntC0EA1x5eodyHzLB', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664790329', '2022-10-03 15:10:29', NULL),
(18, 1, 'sAFWzUtm0veDJKMo2S17LEli8y5VBgX4cdxh9kbCfuYwPHpqaQ', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664791523', '2022-10-03 15:30:23', NULL),
(19, 2, '1RwP2LNoFJldvpTasVMEuSBW7e4OmhyAZnz3tD9iUcGrY8Hqxk', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664791562', '2022-10-03 15:31:02', NULL),
(21, 1, 'NyLnd20fV79rOpoekJCFDPmjgcX4sq8zQBItauGWEbxTwYAZlR', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664792052', '2022-10-03 15:39:12', NULL),
(36, 1, 'hVlkvAtwH4uKnJTE8s3Z5zSrMaLoXmBFND7IWqce2P9fpdUGYx', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664801213', '2022-10-03 18:11:53', NULL),
(37, 2, 'egG6wmWpuA32ZEsnlBIOjMUHkCxyD1vP9ofNah40XL8QtcRSFi', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664802509', '2022-10-03 18:33:29', NULL),
(38, 2, 'cDmqeCfBVMPhFKUaYub73vlsZxHdtL2kn9EzwSXi6jgrQI8yW5', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1664857594', '2022-10-04 09:51:34', NULL),
(69, 2, 'D8JGQ5wCLqMycvO4IYnAES2mR63HWhdKo7iz10ltxkXpbgreN9', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1665034662', '2022-10-06 11:02:42', NULL),
(107, 1, '7miK4F6tJOBeP8soDwpXbrHW0g9jCykTa5vEURMZQhYzlA2NnV', '127.0.0.1', 'Desktop', 'Linux', 'Firefox 105.0', NULL, NULL, 'Login', '1665463725', '2022-10-11 10:13:45', NULL),
(113, 2, 'lCNqgrGXFyK0San25LpTR6UeP8AJzmEIsdHwOWZ4fMhcokVxbv', '192.168.1.29', 'Desktop', 'Windows 10', 'Firefox 105.0', NULL, NULL, 'Login', '1665489550', '2022-10-11 17:24:10', NULL),
(116, 1, 'L9gn542sQfxRD0GwIB7EbKpzhMa8AY1NWqPTFjouiyOrScHl3m', '127.0.0.1', 'Desktop', 'Linux', 'Firefox 103.0', NULL, NULL, 'Login', '1665558702', '2022-10-12 12:36:42', NULL),
(117, 2, 'IdRk1uE3irwHMaPB9SnfxoJjKTpY6Wy2cbLGAthCZgzmeO5sNF', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1665569690', '2022-10-12 15:39:50', NULL),
(118, 2, '5TIOvqzpdtwD21rkybm9SoCEfg8JhALXsjZQu7VHRKcYiUM40n', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1665569940', '2022-10-12 15:44:00', NULL),
(131, 2, 'NWQx9Y1kDFf4nGRMidBEv5CA6gJU7cqSozs8yTbuH0thP3OIpe', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1665654474', '2022-10-13 15:12:54', NULL),
(150, 2, 'YWzHvheuXCMONKdnc1iE2moS4LJQlgyTU8wRDIfB0FGp6VP9a5', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1666087391', '2022-10-18 15:28:11', NULL),
(154, 2, 'UZ7xvYQJbMOiB5IkrFfaKp1Rjy4teglnzLcDTHhwqEW3d8mPV9', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 106.0.0.0', NULL, NULL, 'Login', '1666162869', '2022-10-19 12:26:09', NULL),
(175, 2, '3SPiV6Hqwkcymb1Lj05hBUzfNKd9EAtaIp7RM8lnQreJvGZWuD', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 106.0.0.0', NULL, NULL, 'Login', '1666184747', '2022-10-19 18:30:47', NULL),
(180, 2, 'YLnsl8mhVKG0EOti75c2aRANufxkD4roXbS9P3HFUCeBwd1ZpJ', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1666246216', '2022-10-20 11:35:16', NULL),
(204, 2, 'SMI16uXKsTwJDgCdt7jVexNQb9Op3ncoUzfvly4a5qmYh8R2FW', '192.168.1.29', 'Desktop', 'Windows 10', 'Edge 107.0.1418.26', NULL, NULL, 'Login', '1667308057', '2022-11-01 18:32:37', NULL),
(205, 2, 'R7bTp1EfrON8QSBtwD93yP2nKZLJaUdhmio6jkWlcVA5IHq40G', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1667364311', '2022-11-02 10:10:11', NULL),
(214, 9, 'dViDyTmXHOpNMBvrkfEgh92C0bRU8jnJzc14WsxSqLAuQ356lP', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1667453837', '2022-11-03 11:02:17', NULL),
(215, 2, 'qOTf2X48mFg3WbzhdtSUPA0nQYVMRZCBueIEcl97GpH1iDjwvN', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1667453932', '2022-11-03 11:03:52', NULL),
(217, 2, '7zbGLtRxJEHnrTY3S0hlW9yC1fU64aXpuiP2k8Vc5KoAqNeIvD', '192.168.1.29', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1667456500', '2022-11-03 11:46:40', NULL),
(245, 5, 'Pk4ozhZ6vTjiqf8wtlJD71AyEUO3SXG2mVsL9Ra5CQKId0MeNY', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668426405', '2022-11-14 17:11:45', NULL),
(246, 1, 'FBx9pDGfbYlnt10rWMjkQseRa6mq857iw34OugVASUKZvNodIT', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Forgot', '1668427970', '2022-11-14 17:37:50', NULL),
(247, 2, 'aldQUZWwqfmsHNxiLcVykMvzY6u9O3P72K1rtXA85obCjgJhFD', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668427973', '2022-11-14 17:37:53', NULL),
(249, 2, 'KU3tQxYyHDkJqcTlsCnoLfviWaX7MPgZ9w8NS0bjrOBR6V1epE', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668486740', '2022-11-15 09:57:20', NULL),
(250, 5, 'pvXLoYTFZtHNaw4r35zRWO6cPmjBQ2JfuxyS901KlgGMn8IEdC', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668489250', '2022-11-15 10:39:10', NULL),
(260, 2, 'GWmhCwXMtfk8vyR3reblEn17dH40SABUNZQuo5aF6ITKjODxiY', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1668598833', '2022-11-16 17:05:33', NULL),
(262, 2, '9NoLAnH6BaUvFRqI0Okm8J7dsZXrgi2Mxb3P5w4QlyEhfuTjpD', '192.168.1.29', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668601859', '2022-11-16 17:55:59', NULL),
(263, 2, 'WadFKE4nTUm6R9ZcYt1QgSPOqHVi3vhpwJX2lbCBer07MDu5k8', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1668602878', '2022-11-16 18:12:58', NULL),
(269, 2, '6DKpQ4l1NbjImUJuoyC2fhgZ7MFE0O5zdnwPqvXcTekaYt39H8', '127.0.0.1', 'Desktop', 'Windows 10', 'Firefox 107.0', NULL, NULL, 'Login', '1668683472', '2022-11-17 16:36:12', NULL),
(271, 2, 'HEkWwafmY7cPvsljXC6M81er23hRSyiDzxouKgQqZU9OF4Jnd5', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669015435', '2022-11-21 12:48:55', NULL),
(275, 2, 'U1MyKp640cOitT9SxraNXL3CzJksVBlWHoQFqgDeG5mh8vIREP', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669024797', '2022-11-21 15:24:57', NULL),
(282, 2, 'NKMkEtCObsr4JWy9L6gxmdPzH3ihXZF1qlGapITQUf02cVu7eB', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669095754', '2022-11-22 11:07:34', NULL),
(286, 2, 'Gh6AwdOj3e7CPFaLvgtzmr2RclJZHMbnfkoXiqYKypE0uUNS14', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669120914', '2022-11-22 18:06:54', NULL),
(291, 2, 'jfLQGlIbX73tM5pEdynx9Ukvsma4AHN8cz6iCOFSghZe2wYWrR', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669180177', '2022-11-23 10:34:37', NULL),
(293, 2, 'W4ZAQVxbeXBH7NIKD3LcS8nfdrOpCuh5ikPEyaGUzRjYs9Mgol', '192.168.1.110', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669202199', '2022-11-23 16:41:39', NULL),
(298, 2, 'Hp6ohFqaVJmZDI8G1bx37l9PyXUrM5NOczRTYC0QEKwvjieWBL', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669268160', '2022-11-24 11:01:00', NULL),
(299, 2, 'PyqwAxcNLktz71E9F3Jem2RKVuviYngfsDQpIHBUW4jXlS8r5T', '192.168.1.29', 'Desktop', 'Windows 10', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669268172', '2022-11-24 11:01:12', NULL),
(300, 2, 'XaMIQkN47P9TYJKsAyqwvflFd8po6bCzecOL5i3Vhm0UtB2uDE', '127.0.0.1', 'Desktop', 'Linux', 'Chrome 107.0.0.0', NULL, NULL, 'Login', '1669274557', '2022-11-24 12:47:37', NULL),
(301, 2, '4RHsXAiLmlho8QC1jrkSYVxFK2PdnfbU0NvepE9BOy3DacJGIT', '127.0.0.1', 'Desktop', 'Windows 10', 'Edge 107.0.1418.56', NULL, NULL, 'Login', '1669380860', '2022-11-25 18:19:20', NULL),
(326, 2, 'Y3mPOLWGXj6DkVeMUQbSqo7dpArHElz80ax1ftCRhBwIsi5NyJ', '192.168.1.30', 'Desktop', 'Windows 10', 'Edge 107.0.1418.62', NULL, NULL, 'Login', '1670328572', '2022-12-06 17:34:32', NULL),
(353, 1, 'I8H5YtlA7WXCDVPaLvrJS40jswMiy9o6dhNFpgkTmcQ2efuEBn', '192.168.1.30', 'Desktop', 'Windows 10', 'Edge 107.0.1418.62', NULL, NULL, 'Login', '1670417198', '2022-12-07 18:11:38', NULL),
(364, 2, 'mFkXJeY5AUjHhcnQvCKqOatgo2EdNBTM8WxIizD1VsPGS3ZprL', '127.0.0.1', 'Desktop', 'Windows 10', 'Edge 108.0.1462.42', NULL, NULL, 'Login', '1670824035', '2022-12-12 11:12:15', NULL),
(379, 2, 'b9GiYVcWrgos2TLJ5z6mnDPk7jFdweMxy1H3XvBaZOhEUlItqS', '192.168.1.110', 'Desktop', 'Windows 10', 'Edge 108.0.1462.46', NULL, NULL, 'Login', '1670934419', '2022-12-13 17:51:59', NULL),
(384, 5, 'aSbXqfLpVBjTe56xcgJNtrAUmMYG9dy0zOKoIwkRE1Cn37P8ZQ', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1671082944', '2022-12-15 11:07:24', NULL),
(385, 2, 'GTwe5XKNSRx7UFhtspqDE9Jyck3V8aOLnbzo41gBdPMCIW2umQ', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1671082965', '2022-12-15 11:07:45', NULL),
(396, 9, 'ksgry5KcWz4OoHfG2Dq6ElutiLY80AwJvjCxSTB37XeaMN9dUV', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671189113', '2022-12-16 16:36:53', NULL),
(397, 5, 'VjwvU75bLot9GuM3qNYfixlRXeDr4h6EpKZ1TJaBcPzd8C2IOy', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671189118', '2022-12-16 16:36:58', NULL),
(398, 5, 'rC6y9ancETetI5wNQhsLWubj408ZVFJqpvSAxzmfBYMd1iXGHg', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671189119', '2022-12-16 16:36:59', NULL),
(399, 5, '67Xufwo3QELh9MrZmn0ODUz5PbpjevWA4xlNqtiYVTgFsd2KIH', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671189119', '2022-12-16 16:36:59', NULL),
(400, 5, 'AMdVjOsfy980R3JUBgpk7vEIYh2wo5THre1tq4GXFzPuSDK6nW', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671189128', '2022-12-16 16:37:08', NULL),
(410, 2, 'KBsDjQ05wzhMS3yRfxIY9J4EiPVmqNneurW8UT2ALZa6GtlvdX', '192.168.1.32', 'Desktop', 'Windows 10', 'Edge 108.0.1462.54', NULL, NULL, 'Login', '1671451976', '2022-12-19 17:37:56', NULL),
(411, 2, 'JqWGvaiZnAS961HkUyX34BmCdTcYMrKR0bFQolOw75jzguNh8L', '192.168.1.32', 'Desktop', 'Windows 10', 'Edge 108.0.1462.54', NULL, NULL, 'Login', '1671452248', '2022-12-19 17:42:28', NULL),
(412, 2, 'yh1DPQ4rux6tBfNgFO92dGIAUnH3zcJRLbjK5s8piCaemTXW0M', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1671453864', '2022-12-19 18:09:24', NULL),
(414, 2, 'knEix8CQZjlUaWMFv9HtpBSJcR35hAf2Kd7wyr0OPDGYoIbegm', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671454344', '2022-12-19 18:17:24', NULL),
(417, 1, 'n4Jo2zGXT30sagh6qLm9pEAKveuWVBwIlbY7O8kfUSCQdPNt5x', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671511187', '2022-12-20 10:04:47', NULL),
(419, 2, '5jaJWbPp3V1UYIFBqZuvhS6fNXMsz2yiEewdDc4QngC0L8Grxo', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671539751', '2022-12-20 18:00:51', NULL),
(420, 2, '9da1lLt43ozZUqHIAhijfmM2KFcgWpCBNVRnJTY0OEy6SuD5Pr', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Forgot', '1671606352', '2022-12-21 12:30:52', NULL),
(427, 2, 't3Q1RJ06ujbYEwfvhUsAOPK7ZNqde2HCBSzGFolInMDyxVi9kc', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671612840', '2022-12-21 14:19:00', NULL),
(429, 2, '8Sm3zWJO1RrkpVflhuL2Cjc9wIAZo5qYQbyPUdvKEx0nX6MsaG', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671699327', '2022-12-22 14:20:27', NULL),
(430, 17, 's4lKS2JIbWk8tLfMuNdOieGZxF359pCm1ETynr7wHPB6zhcjva', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1671775204', '2022-12-23 11:25:04', NULL),
(437, 2, '2KyYJtnRxhXw30CdqVpHeMBQLZT1NEcj6WaFmAz8UPlsv59orD', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1672035247', '2022-12-26 11:39:07', NULL),
(441, 2, '70UZ6mYvT3zEalgMp1FBHbONwuqLctGAsJXido2P5Wyhk9DfeK', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1672041806', '2022-12-26 13:28:26', NULL),
(463, 2, 'HjFnxrvdaoC9IquQ7KJYRtALgVDNGPi4wW0ETXs5eml1bck6zM', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1672123199', '2022-12-27 12:04:59', NULL),
(469, 2, 'dNnB5cvoi83qMGa6Cz4FI9WwZSKgxJDA2EeXpmQHsOy1LbrYVu', '192.168.1.30', 'Desktop', 'Windows 10', 'Firefox 108.0', NULL, NULL, 'Login', '1672384254', '2022-12-30 12:35:54', NULL),
(480, 2, 'J6WBlbEuZeiqj1f8p2KkTysdtHwcmM7XzLYIP3CDS5RhgxNnUr', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1672896875', '2023-01-05 10:59:35', NULL),
(487, 1, 'g7DLB12J8POzIlypeTUiHqsSuM5rKobkvQaEmNYtc3fxVhAwnC', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1673357481', '2023-01-10 18:56:21', NULL),
(498, 2, 'RwT5HWoBpiuXFgtKk9rGMZJqzl3QCmVbn1I0NyDLEa67UxePA2', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 108.0.0.0', NULL, NULL, 'Login', '1673593238', '2023-01-13 12:25:38', NULL),
(499, 2, '3OAofCFQ6MLks85pHluIwNPcaY9SBxXZgzJqnd2R7jThi10UVD', '127.0.0.1', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1673603463', '2023-01-13 15:16:03', NULL),
(513, 2, 'OT5SFgraXkNKo9s3YHcq7PWEuwpj2imlDyn0LAetR1JhVUCfx6', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1673933162', '2023-01-17 10:51:02', NULL),
(514, 2, 'GwevErlqC6cOZpY9zxNSX0Pof5i1hJQBbDuTMjVW3FtL4IRdsm', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1673933162', '2023-01-17 10:51:02', NULL),
(518, 2, 'FAHIBryuiSgX92cOGsxV48tLjh1Y7oTPb6pDdQ3em0w5CUEqal', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1674131585', '2023-01-19 17:58:05', NULL),
(519, 2, 'AsfCES8rnF7ONk6lzahj9cybptWuGIqTgvUiRM43LQ2X0eVo5w', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1674222744', '2023-01-20 19:17:24', NULL),
(521, 2, 'Fl3E0p8kdbAuv1mW4QeH6CZaIgyBcRjTo9DPOUJ7LGwqVzrshS', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1674644918', '2023-01-25 16:33:38', NULL),
(522, 2, 'PczjgVD7oNQmtCS3AfWy2vOrRdGhFXY4nUi9pwaLxTlbB5uHMk', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675060332', '2023-01-30 11:57:12', NULL),
(525, 2, 'd3cN2AiuH0DpM5jna7qKPyr4mwBzEVQJfvo81XkSUetWgFlTsR', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 94.0.4606.61', NULL, NULL, 'Login', '1675337131', '2023-02-02 16:50:31', NULL),
(529, 2, 'NkaOjWhEzr9qvD3YKlVmwPC16iGZbcpt2u50RUdeTxJHs4yQfI', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 94.0.4606.61', NULL, NULL, 'Login', '1675337347', '2023-02-02 16:54:07', NULL),
(530, 2, '5UnGmFgitExyvuoaze7A4XSQhcJp9KDkIMYWZPN6V82w3lT0sf', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675415405', '2023-02-03 14:35:05', NULL),
(531, 2, 'mThYZAkMjpOiqPdI3HF2lEQs5yG46cnt8rxDfSgUwuWV7vNJBb', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675416071', '2023-02-03 14:46:11', NULL),
(533, 2, 'NtCpUlgdAY2b0PnWyQXmETszarcMV4kB5fIiuvOo78KF6H13jS', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675428861', '2023-02-03 18:19:21', NULL),
(540, 2, 'IhD3rc7JMRaPFlemWVpHoKLYQuNbB4kn6wTZEdxUAXS5qtC1sj', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677262', '2023-02-06 15:19:22', NULL),
(541, 5, 'jnzWiePaCHqouIs7RO5AyvJlVkLmfK98drg4hXTtM3BSwpb2xG', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677553', '2023-02-06 15:24:13', NULL),
(542, 5, 'f62eWoiRazYQIEAmn3PNyd8JZ1GwhuLTCxblDgHVBvrjp07Fs4', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677706', '2023-02-06 15:26:46', NULL),
(543, 5, 'eVgsTYJ6l3NHQKC4juZrDdoP1Mpin0B9XqxRWwvFzmSbUOIyAG', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677732', '2023-02-06 15:27:12', NULL),
(544, 5, 'zeRcYhCbsuT279DxVHqIaJGP5ALv63fygmZpoiQM1UKnkEOSNw', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677747', '2023-02-06 15:27:27', NULL),
(545, 5, '7lfqAOLZNbmGBwngz4Dk6iRCo5uEMW13TXjpKSer02J9sdhFIv', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677825', '2023-02-06 15:28:45', NULL),
(546, 5, 'P6w9ypoADCXRlGYhkcFUie1KtgqnrMjsvJO8dZx2QB3WfN4LEI', '192.168.1.30', 'Desktop', 'Unknown Platform', 'Unidentified User Agent', NULL, NULL, 'Login', '1675677864', '2023-02-06 15:29:24', NULL),
(555, 1, 'hufUdZVO4gXSk7N9rDPHw0jvBmJKFWi6lcGCAyEIMs2aT38toz', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675684627', '2023-02-06 17:22:07', NULL),
(556, 1, '4mgPxCVsteqSlJHDoQOk9NU8FTcKwi7fYpWhyM61uvjIZ3d5Az', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675685158', '2023-02-06 17:30:58', NULL),
(557, 2, '9dWc7HXihJtjLan8OTRGFp5oNfuBMYAP3w0eUCVKDsEblIrqZS', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 109.0.0.0', NULL, NULL, 'Login', '1675685954', '2023-02-06 17:44:14', NULL),
(565, 2, 'vIpHqrNbanMfxm1FgclXQ7R4WCeEVzB6ZDOTskKdh0o9jJAy8t', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 110.0.5481.77', NULL, NULL, 'Login', '1676436052', '2023-02-15 10:05:52', NULL),
(566, 2, 'GE8T4h0zZcSNxe65RLBPI3CAUmswOHqpukQbXWVFoYd1fyKv9g', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 110.0.5481.77', NULL, NULL, 'Login', '1676437024', '2023-02-15 10:22:04', NULL),
(568, 2, 'ZYbW24d3GHeQzimEVMhKkXApNgS0DTPsr6qv1BI9uCto5FLaln', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 110.0.0.0', NULL, NULL, 'Forgot', '1676529339', '2023-02-16 12:00:39', NULL),
(584, 2, '9iCKZvlrOT5WLSUa6qNpoPMmwF7QbzVthun8eI3xdyX02EkRGJ', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 110.0.0.0', NULL, NULL, 'Login', '1676613426', '2023-02-17 11:22:06', NULL),
(588, 1, '0BVyiCOqxEmJRDHb6LfAa5o4gI91lXWSjUTc3GsFtz8uPkYZQ2', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 110.0.0.0', NULL, NULL, 'Login', '1676628838', '2023-02-17 15:38:58', NULL),
(589, 17, 'TXdNmkn4rblh7wtMUfcE28jW1KZL03HoQ5x9PS6zuGsyVgAqeD', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 110.0.0.0', NULL, NULL, 'Login', '1677732418', '2023-03-02 10:11:58', NULL),
(592, 2, 'vGNEY8Dab9W4VkQqeL1hpP0UJZKux67mrRgBonIF2jStXOf3cw', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1678705864', '2023-03-13 16:36:04', NULL),
(593, 2, 'RJzFLU86uNIjKT2fxCHOXSn1Vre7hMam3Z94iqg0AyGPwbltQW', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1678707075', '2023-03-13 16:56:15', NULL),
(594, 2, 'Sa8lv7KyuznTjiJsIgeWwmCQ5HMXoLxNdGZbtcVU46F0qOf9PB', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1678708061', '2023-03-13 17:12:41', NULL),
(599, 2, '32kAj87sS9RDWMYfHOm645pJzQUTueytnXKI1FlqCZcg0LaiNd', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 108.0.5359.179', NULL, NULL, 'Login', '1679551565', '2023-03-23 11:31:05', NULL),
(602, 2, 'h1iPcVW90mYSpjqNMDFrUt2TzvA3s5RnwbQyBag8IxoEHOlZKG', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1679893624', '2023-03-27 10:32:04', NULL),
(603, 2, 'giNAv2FW7LdQYUy1TE3lGxMJSbBmPpqjDtZ5VeHh8za9n4CRsc', '192.168.1.30', 'Desktop', 'Windows 10', 'Edge 111.0.1661.51', NULL, NULL, 'Login', '1679895358', '2023-03-27 11:00:58', NULL),
(604, 2, 'FmnNe5s9Jl8ZhRxGBM7j2A3dLwKgvbqrYiSyUWQ1fHpToDOzaX', '127.0.0.1', 'Desktop', 'Windows 10', 'Edge 111.0.1661.54', NULL, NULL, 'Login', '1679909224', '2023-03-27 14:52:04', NULL),
(605, 2, 'Zty7ip8YqQ6Rh4A5Ig1P2mwXDH3sK9BTzFrubCEeWdVfkJOM0a', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1679983063', '2023-03-28 11:22:43', NULL),
(606, 2, '3DFrekcEGtqW8R2yTSOAm7CUHwQa1MoxfV4BsPngZuJlzNX05p', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1680601003', '2023-04-04 15:01:43', NULL),
(607, 2, '3Gv0LPJ2CnM9fWK8DQRt4AeirkgHTsz1mbZBdSlXNwI6aqY5xc', '192.168.1.30', 'Desktop', 'Windows 10', 'Edge 111.0.1661.62', NULL, NULL, 'Login', '1680680037', '2023-04-05 12:58:57', NULL),
(608, 2, 'Snp0qMvb3C6DEL98JNAKVW45dzYr1xR7GiewhQXIug2ylHmkTa', '127.0.0.1', 'Desktop', 'Windows 10', 'Chrome 111.0.0.0', NULL, NULL, 'Login', '1680680517', '2023-04-05 13:06:57', NULL),
(609, 2, 'qoWhPxD6bVrgLmi8HAK7QFM50ItyB1G4Jd3XSjzvClOETRcU2e', '192.168.1.30', 'Desktop', 'Windows 10', 'Chrome 112.0.0.0', NULL, NULL, 'Login', '1680756296', '2023-04-06 10:09:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bank_fields`
--

CREATE TABLE `bank_fields` (
  `id` int(11) UNSIGNED NOT NULL,
  `company_bank_id` int(11) UNSIGNED NOT NULL,
  `key` varchar(200) NOT NULL,
  `value` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bank_fields`
--

INSERT INTO `bank_fields` (`id`, `company_bank_id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(9, 3, 'TaskForce', '789645123', '2022-12-26 17:37:36', NULL),
(10, 3, 'FatherPole', '123654789', '2022-12-26 17:37:36', NULL),
(12, 2, 'Stake 1', '145236', '2023-02-02 14:36:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `client_name` varchar(100) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `enroll_date` date NOT NULL,
  `tax_no` varchar(100) DEFAULT NULL,
  `gst_vat_no` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address_1` varchar(100) NOT NULL,
  `address_2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(100) DEFAULT NULL,
  `country_id` int(11) UNSIGNED NOT NULL,
  `source_by` int(11) UNSIGNED DEFAULT NULL,
  `source_from` int(11) UNSIGNED DEFAULT NULL,
  `client_group_id` int(100) UNSIGNED DEFAULT NULL,
  `is_bifurcated` enum('Yes','No') NOT NULL DEFAULT 'No',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `subscriber_id`, `client_name`, `company_name`, `enroll_date`, `tax_no`, `gst_vat_no`, `email`, `phone`, `address_1`, `address_2`, `city`, `state`, `zip_code`, `country_id`, `source_by`, `source_from`, `client_group_id`, `is_bifurcated`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Paul walker', 'Paul PVT. LTD.', '2022-10-10', '123456789s', '789456123s', 'infos@mindtech.com', '2356897410', 'testing address', '', 'Ahmedabad', 'Gujarat', '380015', 1, 2, 2, 2, 'Yes', 'Active', 2, 2, '2022-10-10 16:00:20', '2022-12-16 14:51:35'),
(3, 1, 'Jim Turner', 'Jim Turner PVT. LTD', '2022-10-04', '6545446', '6545878', 'tbs@gmail.com', '01234567890', 'Jodhpur Char Rasta', 'Nr. Star Bazar', 'Ahmedabad', 'Gujarat', '360-450', 1, 4, 3, 2, 'No', 'Active', 2, 2, '2022-10-11 15:23:50', '2023-03-23 17:38:04'),
(4, 4, 'Jim Tocku', 'Jim Sales', '2021-02-01', '123456789s', '6545446', 'team.tbs22@gmail.com', '123456789', 'Address Line 1\r\nAddress Line 2', 'Address Line 1\r\nAddress Line 2', 'City', 'State', '11461', 1, 5, 4, 3, 'No', 'Active', 18, NULL, '2023-02-16 16:35:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_contributed_user`
--

CREATE TABLE `client_contributed_user` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL,
  `contributor_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `client_contributed_user`
--

INSERT INTO `client_contributed_user` (`id`, `subscriber_id`, `client_id`, `contributor_id`) VALUES
(5, 4, 4, 5),
(8, 1, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `client_groups`
--

CREATE TABLE `client_groups` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `group_name` varchar(100) NOT NULL,
  `description` text,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `client_groups`
--

INSERT INTO `client_groups` (`id`, `subscriber_id`, `group_name`, `description`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 1, 'USA', 'this is USA client group', 'Active', 2, 2, '2022-10-10 10:48:22', '2022-10-11 11:37:05'),
(3, 4, 'Indian Client', '', 'Active', 18, NULL, '2023-02-16 16:34:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `trading_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_number` varchar(100) NOT NULL,
  `website` varchar(100) NOT NULL,
  `registration_no` varchar(100) DEFAULT NULL,
  `enroll_date` date NOT NULL,
  `tax_no` varchar(100) DEFAULT NULL,
  `gst_vat_no` varchar(100) DEFAULT NULL,
  `currency_id` int(11) UNSIGNED NOT NULL,
  `address_1` varchar(100) NOT NULL,
  `address_2` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `zip_code` varchar(100) DEFAULT NULL,
  `country_id` int(11) UNSIGNED NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `subscriber_id`, `company_name`, `trading_name`, `email`, `contact_number`, `website`, `registration_no`, `enroll_date`, `tax_no`, `gst_vat_no`, `currency_id`, `address_1`, `address_2`, `city`, `state`, `zip_code`, `country_id`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 1, 'Business Solution LLP', 'BSLS', 'info@businesssoluction.com', '8546958245', 'businessoluction.com', '564ED123', '2022-10-10', 'JDINM5411', '56493', 1, 'Testing Address', '', 'Ahmedabad', 'Gujarat', '380015', 1, 'Active', 2, 2, '2022-10-11 13:00:06', '2022-12-16 12:15:17'),
(3, 1, 'Technobrains Solution LLP.', 'TBS', 'info@technobrain.com', '8546958285', 'technobrain.com', '564ED12385', '2022-10-11', 'JDINM541122', '56493df', 1, 'Testing Address', '', 'Ahmedabad', 'Gujarat', '380015', 1, 'Active', 2, 2, '2022-10-14 15:22:03', '2022-12-02 16:52:21'),
(5, 1, 'Tata Consultancy Service', 'TCS', 'info@tcs.com', '8546958252', 'tcs.com', '564ED1s385', '2022-10-19', 'JDINM54r174', '56493252', 1, 'Testing Address', '', 'Ahmedabad', 'Gujarat', '380015', 1, 'Active', 2, 2, '2022-10-19 18:05:52', '2022-12-07 10:01:30'),
(6, 4, 'Rama Sales', 'RMS', 'team.tbs22@gmail.com', '123456789', 'http://demo1iaps.nexiptel.com/', '123456', '2023-02-01', '6545446', '6545446', 1, 'Address Line 1', 'Address Line 2', 'City', 'State', '11461', 1, 'Active', 18, 18, '2023-02-16 15:40:34', '2023-02-16 16:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `company_banks`
--

CREATE TABLE `company_banks` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_detail_name` varchar(100) NOT NULL,
  `account_number` varchar(200) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_banks`
--

INSERT INTO `company_banks` (`id`, `subscriber_id`, `company_id`, `bank_name`, `bank_detail_name`, `account_number`, `account_name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 1, 2, 'SBI', 'Bank account 1', '15945638', 'xxxxxxxxxxxxx', 2, 2, '2022-12-26 15:36:50', '2023-02-02 14:36:29'),
(3, 1, 2, 'ICICI', 'Bank account 2', '15945638', 'Mahendra Raj', 2, 2, '2022-12-26 16:06:45', '2022-12-26 17:37:36'),
(4, 4, 6, 'Test 1 ', 'Test', '123456', 'Demo test', 18, NULL, '2023-02-16 15:42:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_clients`
--

CREATE TABLE `company_clients` (
  `id` int(11) UNSIGNED NOT NULL,
  `company_id` int(100) UNSIGNED NOT NULL,
  `client_id` int(100) UNSIGNED NOT NULL,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_clients`
--

INSERT INTO `company_clients` (`id`, `company_id`, `client_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(28, 3, 1, 2, NULL, '2022-12-02 16:52:21', NULL),
(31, 5, 1, 2, NULL, '2022-12-07 10:01:30', NULL),
(36, 2, 1, 2, NULL, '2022-12-16 12:15:17', NULL),
(38, 6, 4, 18, NULL, '2023-02-16 16:35:50', NULL),
(42, 2, 3, 2, NULL, '2023-03-23 17:38:04', NULL),
(43, 3, 3, 2, NULL, '2023-03-23 17:38:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_financial_years`
--

CREATE TABLE `company_financial_years` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `company_id` int(100) UNSIGNED NOT NULL,
  `financial_year_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_default` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_financial_years`
--

INSERT INTO `company_financial_years` (`id`, `subscriber_id`, `company_id`, `financial_year_name`, `start_date`, `end_date`, `is_default`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 1, 2, '2022-2023', '2022-04-01', '2023-03-31', 'No', 2, 2, '2022-10-14 13:19:04', '2022-11-21 12:34:30'),
(3, 1, 2, '2021-2022', '2021-04-01', '2022-03-31', 'No', 2, 2, '2022-10-14 13:20:33', '2022-11-21 12:34:02'),
(5, 1, 5, '2022-2023', '2022-04-01', '2023-03-31', 'Yes', 2, NULL, '2022-10-19 00:00:00', NULL),
(6, 1, 3, '2022-2023', '2022-04-01', '2023-03-31', 'Yes', 2, NULL, '2022-11-24 16:58:44', NULL),
(7, 4, 6, '2022-2023', '2022-04-01', '2023-03-31', 'Yes', 18, NULL, '2023-02-16 15:41:13', NULL),
(8, 1, 2, '2023-2024', '2023-04-01', '2024-03-31', 'Yes', 2, NULL, '2023-04-04 11:29:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_settings`
--

CREATE TABLE `company_settings` (
  `id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `company_logo` varchar(100) DEFAULT NULL,
  `company_code` varchar(255) DEFAULT NULL,
  `invoice_number_type` int(11) NOT NULL DEFAULT '1',
  `prefix_company_code` int(11) NOT NULL DEFAULT '0',
  `prefix_company_year` int(11) NOT NULL DEFAULT '0',
  `prefix_company_month` int(11) NOT NULL DEFAULT '0',
  `invoice_prefix_date_format` varchar(255) DEFAULT NULL,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_settings`
--

INSERT INTO `company_settings` (`id`, `company_id`, `company_logo`, `company_code`, `invoice_number_type`, `prefix_company_code`, `prefix_company_year`, `prefix_company_month`, `invoice_prefix_date_format`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 2, '1671019940_BUS_1671019940_17ae2fc1716a8c420c38.png', 'BUS', 1, 0, 0, 0, 'd-M', 2, 2, '2023-01-03 13:24:04', NULL),
(3, 3, '1672989682_TBS_1672989682_ffc6dd9f910f13962617.png', 'TBS', 2, 1, 1, 1, 'M', 2, 2, '2023-01-06 12:51:22', NULL),
(4, 5, '1669032048_TATA.webp', 'TATA', 2, 0, 1, 1, 'M', 2, 2, '2023-01-04 18:08:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `company_users`
--

CREATE TABLE `company_users` (
  `id` int(11) UNSIGNED NOT NULL,
  `company_id` int(100) UNSIGNED NOT NULL,
  `user_id` int(100) UNSIGNED NOT NULL,
  `is_default` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_users`
--

INSERT INTO `company_users` (`id`, `company_id`, `user_id`, `is_default`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(50, 2, 9, 'Yes', 2, NULL, '2022-12-26 13:00:49', NULL),
(51, 3, 9, 'No', 2, NULL, '2022-12-26 13:00:49', NULL),
(52, 5, 9, 'No', 2, NULL, '2022-12-26 13:00:49', NULL),
(54, 5, 5, 'No', 2, NULL, '2023-02-06 15:38:18', NULL),
(55, 2, 5, 'No', 2, NULL, '2023-02-06 15:38:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contribution_ratio`
--

CREATE TABLE `contribution_ratio` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `ratio` decimal(16,2) NOT NULL,
  `description` text,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED NOT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `contribution_slabs`
--

CREATE TABLE `contribution_slabs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_contribution_id` int(11) UNSIGNED NOT NULL,
  `from` decimal(16,2) NOT NULL DEFAULT '0.00',
  `to` decimal(16,2) NOT NULL DEFAULT '0.00',
  `amount_type` enum('%','Flat') NOT NULL DEFAULT '%',
  `amount` decimal(16,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contribution_slabs`
--

INSERT INTO `contribution_slabs` (`id`, `user_contribution_id`, `from`, `to`, `amount_type`, `amount`) VALUES
(38, 12, '0.00', '10000.00', '%', '0.00'),
(39, 12, '10001.00', '20000.00', '%', '1.50'),
(40, 12, '20001.00', '10000000.00', '%', '2.20');

-- --------------------------------------------------------

--
-- Table structure for table `contributors`
--

CREATE TABLE `contributors` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `first_name` varchar(200) NOT NULL,
  `last_name` varchar(200) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contributors`
--

INSERT INTO `contributors` (`id`, `subscriber_id`, `first_name`, `last_name`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 'Shivani', 'Shah', 'Active', '2023-02-01 11:51:44', NULL),
(4, 1, 'Will', 'Miles', 'Active', '2023-02-01 11:51:55', NULL),
(5, 4, 'Gopal', 'Makadiya', 'Active', '2023-02-16 16:34:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) UNSIGNED NOT NULL,
  `country_name` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `country_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'India', 'Active', '2022-10-03 14:36:47', NULL),
(2, 'USA', 'Active', '2022-10-03 14:36:47', NULL),
(3, 'Australia', 'Active', '2022-10-03 14:36:47', NULL),
(4, 'UK', 'Active', '2022-10-03 14:36:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `country_taxes`
--

CREATE TABLE `country_taxes` (
  `id` int(11) UNSIGNED NOT NULL,
  `country_id` int(11) UNSIGNED DEFAULT NULL,
  `tax_name` varchar(255) NOT NULL,
  `rate` int(11) UNSIGNED NOT NULL,
  `is_percentage` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `country_taxes`
--

INSERT INTO `country_taxes` (`id`, `country_id`, `tax_name`, `rate`, `is_percentage`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(3, 1, 'CGST', 18, 'Yes', 'Active', 1, 1, '2022-10-06 10:05:33', '2022-10-19 13:14:39'),
(4, 1, 'IGST', 8, 'Yes', 'Active', 1, NULL, '2022-10-19 13:14:23', NULL),
(5, 1, 'SGST', 12, 'Yes', 'Active', 1, NULL, '2022-10-31 14:34:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int(11) UNSIGNED NOT NULL,
  `currency_name` varchar(100) NOT NULL,
  `currency_symbol` varchar(100) NOT NULL,
  `short_code` varchar(100) NOT NULL,
  `locale` varchar(10) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `currency_name`, `currency_symbol`, `short_code`, `locale`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Indian Rupees', '₹', 'INR', 'en_IN', 'Active', '2022-10-03 14:36:47', '2022-11-03 13:04:46'),
(2, 'Dollar', '$', 'USD', 'en_US', 'Active', '2022-10-03 14:36:47', NULL),
(3, 'Euro', '€', 'EUR', 'de_DE', 'Active', '2022-11-07 11:19:26', '2022-11-07 11:20:05'),
(4, 'Canadian Dollar', 'C$', 'CAD', 'en-CA', 'Active', '2022-12-30 12:35:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `email_configrations`
--

CREATE TABLE `email_configrations` (
  `id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `host` varchar(100) NOT NULL,
  `port` int(11) NOT NULL,
  `auth` enum('TRUE','FALSE') NOT NULL DEFAULT 'TRUE',
  `encryption` enum('NONE','TLS','SSL') NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `sender_email` varchar(100) NOT NULL,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `email_configrations`
--

INSERT INTO `email_configrations` (`id`, `company_id`, `host`, `port`, `auth`, `encryption`, `username`, `password`, `sender_email`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 3, '192.168.0.1', 457, 'TRUE', 'NONE', 'info@gmail.com', '31December@!', 'info@gmail.com', 2, 2, '2022-11-10 15:11:23', '2022-11-15 12:15:30');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `category_id` int(11) UNSIGNED NOT NULL,
  `subcategory_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `subscriber_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `subscriber_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `USD_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `USD_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `subscriber_id`, `company_id`, `category_id`, `subcategory_id`, `title`, `date`, `amount`, `subscriber_ccr`, `subscriber_amount`, `USD_ccr`, `USD_amount`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(7, 1, 2, 3, 6, 'Salary 2022-12', '2022-12-08', '100000.00', '1.000000', '100000.00', '0.012154', '1215.40', 2, 2, '2022-12-08 13:22:39', '2023-01-10 17:05:39'),
(8, 1, 2, 3, 4, 'Salary 2022-11', '2022-12-08', '35000.00', '1.000000', '35000.00', '0.012154', '425.39', 2, 2, '2022-12-08 13:27:30', '2023-01-10 16:51:46'),
(10, 1, 2, 3, 4, 'Demo', '2023-01-10', '35000.00', '1.000000', '35000.00', '0.012174', '426.09', 2, NULL, '2023-01-10 17:07:04', NULL),
(11, 1, 3, 3, 6, 'Demo 2', '2023-01-10', '100000.00', '1.000000', '100000.00', '0.012174', '1217.40', 2, 2, '2023-01-10 17:07:41', '2023-01-17 13:05:16'),
(20, 1, 5, 3, 4, 'demo', '2023-01-23', '123.00', '1.000000', '123.00', '0.012324', '1.52', 2, NULL, '2023-01-23 17:09:03', NULL),
(21, 1, 5, 5, 7, 'wewe', '2023-01-23', '1234.00', '1.000000', '1234.00', '0.012324', '15.21', 2, NULL, '2023-01-23 17:09:04', NULL),
(22, 1, 2, 5, 7, 'Sub Category 3 | Apr 2023', '2023-04-30', '5000.00', '1.000000', '5000.00', '0.012169', '60.85', 2, NULL, '2023-04-04 11:10:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED NOT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`id`, `subscriber_id`, `name`, `parent_id`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(3, 1, 'Category 1', NULL, 'Active', 2, 2, '2022-12-07 15:12:33', '2023-01-10 17:04:32'),
(4, 1, 'Sub Category 1', 3, 'Active', 2, 2, '2022-12-07 17:43:21', '2023-01-10 17:04:25'),
(5, 1, 'Category 2', NULL, 'Active', 2, NULL, '2023-01-10 15:27:22', NULL),
(6, 1, 'Sub Category 2', 3, 'Active', 2, NULL, '2023-01-10 17:04:47', NULL),
(7, 1, 'Sub Category 3', 5, 'Active', 2, NULL, '2023-01-17 12:51:42', NULL),
(13, 4, 'Category 1', NULL, 'Active', 1, NULL, '2023-02-16 17:54:09', NULL),
(14, 4, 'Sub Category 1', 13, 'Active', 1, NULL, '2023-02-16 17:54:09', NULL),
(15, 4, 'Sub Category 2', 13, 'Active', 1, NULL, '2023-02-16 17:54:09', NULL),
(16, 4, 'Category 2', NULL, 'Active', 1, NULL, '2023-02-16 17:54:09', NULL),
(17, 4, 'Sub Category 3', 16, 'Active', 1, NULL, '2023-02-16 17:54:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `incomes`
--

CREATE TABLE `incomes` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `category_id` int(11) UNSIGNED NOT NULL,
  `subcategory_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `subscriber_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `subscriber_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `USD_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `USD_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `incomes`
--

INSERT INTO `incomes` (`id`, `subscriber_id`, `company_id`, `category_id`, `subcategory_id`, `title`, `date`, `amount`, `subscriber_ccr`, `subscriber_amount`, `USD_ccr`, `USD_amount`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(8, 1, 2, 3, 6, 'SubCategory 2 | Feb 2023', '2023-02-28', '25800.00', '1.000000', '25800.00', '0.012093', '312.00', 2, NULL, '2023-02-21 15:23:00', NULL),
(9, 1, 5, 4, 7, 'SubCategory 3 | Feb 2023', '2023-02-28', '12365.00', '1.000000', '12365.00', '0.012093', '149.53', 2, NULL, '2023-02-21 15:27:42', NULL),
(11, 1, 3, 3, 6, 'SubCategory 2 | Feb 2023', '2023-02-28', '65000.00', '1.000000', '65000.00', '0.012081', '785.27', 2, NULL, '2023-02-22 14:23:57', NULL),
(12, 1, 2, 4, 7, 'SubCategory 3 | Feb 2023', '2023-02-28', '5000.00', '1.000000', '5000.00', '0.012081', '60.41', 2, NULL, '2023-02-22 15:50:00', NULL),
(13, 1, 2, 3, 6, 'SubCategory 2 | Mar 2023', '2023-03-31', '500.00', '1.000000', '500.00', '0.012160', '6.08', 2, NULL, '2023-03-30 12:51:28', NULL),
(14, 1, 2, 3, 5, 'Sub Category 1 | Mar 2023', '2023-03-31', '55.00', '1.000000', '55.00', '0.012160', '0.67', 2, NULL, '2023-03-30 12:52:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `income_categories`
--

CREATE TABLE `income_categories` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED NOT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `income_categories`
--

INSERT INTO `income_categories` (`id`, `subscriber_id`, `name`, `parent_id`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(3, 1, 'Category 1', NULL, 'Active', 2, NULL, '2023-02-17 11:26:46', NULL),
(4, 1, 'Category 2', NULL, 'Active', 2, NULL, '2023-02-17 11:26:52', NULL),
(5, 1, 'Sub Category 1', 3, 'Active', 2, NULL, '2023-02-17 11:27:23', NULL),
(6, 1, 'SubCategory 2', 3, 'Active', 2, NULL, '2023-02-17 11:27:39', NULL),
(7, 1, 'SubCategory 3', 4, 'Active', 2, NULL, '2023-02-17 11:27:52', NULL),
(9, 1, 'Category 3', NULL, 'Active', 2, NULL, '2023-02-17 11:40:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_no` varchar(100) NOT NULL,
  `invoice_date` date NOT NULL,
  `invoice_due_date` date NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL,
  `company_financial_id` int(11) UNSIGNED NOT NULL,
  `is_bifurcated` enum('Yes','No') NOT NULL DEFAULT 'No',
  `discount_type` varchar(255) DEFAULT NULL,
  `is_display_company_amount` enum('Yes','No') NOT NULL DEFAULT 'No',
  `invoice_currency_id` int(11) UNSIGNED NOT NULL,
  `company_currency_id` int(11) UNSIGNED NOT NULL,
  `invoice_currency_total_amount` decimal(16,2) NOT NULL,
  `company_currency_total_amount` decimal(16,2) NOT NULL,
  `currency_conversion_rate` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `invoice_currency_amount_received` decimal(16,2) NOT NULL DEFAULT '0.00',
  `company_currency_amount_received` decimal(16,2) NOT NULL DEFAULT '0.00',
  `total_tax_amount` decimal(16,2) NOT NULL,
  `total_discount` decimal(16,2) DEFAULT NULL,
  `total_deduction` decimal(16,2) NOT NULL,
  `subtotal` decimal(16,2) NOT NULL,
  `invoice_status` varchar(255) NOT NULL,
  `term_id` int(11) UNSIGNED DEFAULT NULL,
  `total_remaining_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `total_difference` decimal(16,2) NOT NULL DEFAULT '0.00',
  `subscriber_currency_id` int(10) UNSIGNED DEFAULT NULL,
  `subscriber_currency_conversion_rate` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `subscriber_currency_total_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `USD_currency_conversion_rate` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `USD_currency_total_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `invoice_note` text,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_no`, `invoice_date`, `invoice_due_date`, `subscriber_id`, `company_id`, `client_id`, `company_financial_id`, `is_bifurcated`, `discount_type`, `is_display_company_amount`, `invoice_currency_id`, `company_currency_id`, `invoice_currency_total_amount`, `company_currency_total_amount`, `currency_conversion_rate`, `invoice_currency_amount_received`, `company_currency_amount_received`, `total_tax_amount`, `total_discount`, `total_deduction`, `subtotal`, `invoice_status`, `term_id`, `total_remaining_amount`, `total_difference`, `subscriber_currency_id`, `subscriber_currency_conversion_rate`, `subscriber_currency_total_amount`, `USD_currency_conversion_rate`, `USD_currency_total_amount`, `invoice_note`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(19, 'BUS/2223/Nov/0001', '2022-01-16', '2022-11-30', 1, 2, 1, 2, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '15477.00', '1010682.27', '82.280804', '0.00', '0.00', '3193.67', '0.00', '0.00', '12283.33', 'Due', NULL, '1273460.00', '1273460.00', 1, '82.280804', '1010682.27', '1.000000', '12283.33', 'null', 2, 2, '2022-11-16 12:29:08', '2023-01-03 18:01:24'),
(20, 'BUS/2223/Nov/0002', '2022-07-01', '2022-07-15', 1, 2, 3, 2, 'Yes', 'AFTER_TAX_PR', 'Yes', 2, 1, '1817.57', '146733.03', '82.280360', '800.00', '65901.08', '214.00', '179.76', '50.00', '1783.33', 'Partial', 1, '146733.03', '83649.23', 1, '82.280360', '146733.03', '1.000000', '1783.33', '', 2, 2, '2022-11-16 15:07:42', '2023-01-06 11:38:06'),
(22, 'BUS/2223/Nov/0003', '2022-11-24', '2022-12-13', 1, 2, 1, 2, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '393.97', '27470.94', '82.280360', '43.00', '32400.00', '60.10', '0.00', '0.00', '333.87', 'Paid', 1, '27470.94', '56409.82', 1, '82.280360', '27470.94', '1.000000', '333.87', 'null', 2, 2, '2022-11-24 13:10:37', '2023-01-11 10:45:13'),
(23, 'TBS/2223/29-Nov/0001', '2022-12-01', '2022-12-15', 1, 3, 3, 6, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '1357.02', '88529.40', '82.200000', '0.00', '0.00', '280.02', '0.00', '0.00', '1077.00', 'Due', 2, '111547.04', '0.00', 1, '82.200000', '88529.40', '1.000000', '1077.00', 'null', 2, 2, '2022-11-29 14:45:15', '2023-01-03 17:56:01'),
(44, 'BUS/2223/28-DEC/0001', '2022-07-01', '2022-07-15', 1, 2, 3, 2, 'Yes', 'AFTER_TAX_PR', 'Yes', 2, 1, '1817.57', '146733.03', '82.280360', '0.00', '0.00', '214.00', '179.76', '50.00', '1783.33', 'Bad Debt', 1, '313891.31', '313891.31', 1, '82.280360', '146733.03', '1.000000', '1783.33', 'Hi This is demo note', 2, 2, '2022-12-28 11:25:41', '2023-01-03 12:59:24'),
(46, 'BUS/2223/28-DEC/0002', '2022-12-28', '2023-01-11', 1, 2, 1, 2, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '735.53', '51441.03', '82.526152', '735.53', '60700.00', '112.20', '0.00', '0.00', '623.33', 'Paid', 1, '0.46', '0.46', 1, '82.526152', '51441.03', '1.000000', '623.33', NULL, 2, 2, '2022-12-28 17:39:39', '2023-01-03 11:30:35'),
(47, 'BUS/2223/28-DEC/0003', '2022-07-01', '2022-07-15', 1, 2, 3, 2, 'Yes', 'AFTER_TAX_PR', 'Yes', 2, 1, '1817.57', '146733.03', '82.280360', '0.00', '0.00', '214.00', '179.76', '50.00', '1783.33', 'Due', 1, '149550.31', '0.00', 1, '82.280360', '146733.03', '1.000000', '1783.33', NULL, 2, 2, '2022-12-28 17:49:27', '2023-01-03 11:30:39'),
(48, 'BUS/2022/30-DEC/0001', '2022-01-16', '2022-11-30', 1, 2, 1, 2, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '15477.00', '1010682.27', '82.280804', '0.00', '0.00', '3193.67', '0.00', '0.00', '12283.33', 'Due', NULL, '1273460.00', '0.00', 1, '82.280804', '1010682.27', '1.000000', '12283.33', 'null', 2, 2, '2022-12-30 11:58:26', '2023-01-03 17:58:37'),
(50, '2223/JAN/0001', '2023-01-05', '2023-01-19', 1, 5, 1, 5, 'No', 'AFTER_TAX_PR', 'No', 2, 1, '133056.00', '7777570.31', '73.651234', '133056.00', '11821900.87', '27456.00', '0.00', '0.00', '105600.00', 'Paid', NULL, '7777570.31', '-2022162.28', 1, '73.651234', '7777570.31', '1.000000', '105600.00', 'This is demo', 2, 2, '2023-01-05 17:10:55', '2023-02-03 19:12:53'),
(51, '0001', '2023-02-16', '2023-03-02', 4, 6, 4, 7, 'No', 'AFTER_TAX_PR', 'No', 1, 1, '279004.44', '236444.44', '1.000000', '0.00', '0.00', '42560.00', '0.00', '0.00', '236444.44', 'Due', NULL, '236444.44', '0.00', 1, '1.000000', '236444.44', '0.012114', '2864.29', 'This is test', 18, NULL, '2023-02-16 16:37:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_attachments`
--

CREATE TABLE `invoice_attachments` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_id` int(11) UNSIGNED NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `document` varchar(200) NOT NULL,
  `document_type_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_attachments`
--

INSERT INTO `invoice_attachments` (`id`, `invoice_id`, `file_name`, `document`, `document_type_id`, `created_at`, `updated_at`) VALUES
(4, 19, 'Demo PDF', '1668583291_05edd79fd229d2b4acb1.pdf', 5, '2022-11-16 12:51:31', NULL),
(8, 22, 'document_1', '1673255984_257c7e5a147874abd4d3.png', 5, '2023-01-09 14:49:44', NULL),
(9, 48, 'document_1', '1673957062_343987b6e8bdaad17b79.jpg', 5, '2023-01-17 17:34:22', NULL),
(10, 48, 'document_2', '1673957062_2f4448d9bd5797280e6a.jpg', 5, '2023-01-17 17:34:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_banks`
--

CREATE TABLE `invoice_banks` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_id` int(11) UNSIGNED NOT NULL,
  `company_bank_id` int(11) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_banks`
--

INSERT INTO `invoice_banks` (`id`, `invoice_id`, `company_bank_id`, `created_at`) VALUES
(23, 46, 2, '0000-00-00 00:00:00'),
(24, 47, 2, '0000-00-00 00:00:00'),
(25, 47, 3, '0000-00-00 00:00:00'),
(30, 44, 2, '0000-00-00 00:00:00'),
(31, 44, 3, '0000-00-00 00:00:00'),
(35, 20, 2, '0000-00-00 00:00:00'),
(36, 20, 3, '0000-00-00 00:00:00'),
(39, 22, 2, '0000-00-00 00:00:00'),
(40, 22, 3, '0000-00-00 00:00:00'),
(41, 51, 4, '2023-02-16 16:37:01');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_id` int(11) UNSIGNED NOT NULL,
  `item_type_id` int(11) UNSIGNED NOT NULL,
  `client_id` int(11) UNSIGNED NOT NULL,
  `is_bifurcated` enum('Yes','No') NOT NULL DEFAULT 'No',
  `resource_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `actual_days` decimal(16,2) NOT NULL,
  `working_days` decimal(16,2) NOT NULL,
  `resource_quantity` decimal(16,2) NOT NULL,
  `rate` decimal(16,2) NOT NULL,
  `deduction` decimal(16,2) NOT NULL,
  `tax_amount` decimal(16,2) NOT NULL,
  `discount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `subtotal` decimal(16,2) NOT NULL DEFAULT '0.00' COMMENT 'Before Discount and Tax Apply.',
  `total_amount` decimal(16,2) NOT NULL DEFAULT '0.00' COMMENT 'After Discount and Tax Apply',
  `description` longtext,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_type_id`, `client_id`, `is_bifurcated`, `resource_name`, `start_date`, `end_date`, `actual_days`, `working_days`, `resource_quantity`, `rate`, `deduction`, `tax_amount`, `discount`, `discount_amount`, `subtotal`, `total_amount`, `description`, `created_at`, `updated_at`) VALUES
(124, 46, 8, 1, 'No', 'Test 123', '2022-12-28', '2023-01-27', '30.00', '22.00', '50.00', '17.00', '0.00', '112.20', '0.00', '0.00', '623.33', '735.53', 'Monthly | 2022-12-28 to 2023-01-27 | Working Days 22 Out Of 30 ', '2023-01-03 11:30:35', NULL),
(125, 47, 8, 1, 'Yes', 'Paul walker - ', '2022-11-16', '2022-12-16', '30.00', '22.00', '5.00', '500.00', '50.00', '214.00', '9.00', '179.76', '1783.33', '1817.57', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 11:30:39', NULL),
(131, 44, 8, 1, 'Yes', 'Paul walker - ', '2022-11-16', '2022-12-16', '30.00', '22.00', '5.00', '500.00', '50.00', '214.00', '9.00', '179.76', '1783.33', '1817.57', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 12:59:24', NULL),
(132, 23, 11, 3, 'No', 'Test 1', '2022-11-29', '2022-11-29', '1.00', '1.00', '40.00', '25.00', '0.00', '260.00', '0.00', '0.00', '1000.00', '1260.00', 'this is demo', '2023-01-03 17:56:01', NULL),
(133, 23, 8, 3, 'No', 'Test 123', '2022-11-29', '2022-12-29', '30.00', '22.00', '3.00', '35.00', '0.00', '20.02', '0.00', '0.00', '77.00', '97.02', 'Monthly | 2022-11-29 to 2022-11-29 | Working Days 22 Out Of 30 ', '2023-01-03 17:56:01', NULL),
(134, 48, 8, 1, 'No', 'Test 1', '2022-11-16', '2022-12-16', '30.00', '22.00', '5.00', '2150.00', '0.00', '2049.67', '0.00', '0.00', '7883.33', '9933.00', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 17:58:37', NULL),
(135, 48, 8, 1, 'No', 'Test 12', '2022-11-16', '2022-12-16', '30.00', '22.00', '3.00', '2000.00', '0.00', '1144.00', '0.00', '0.00', '4400.00', '5544.00', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 17:58:37', NULL),
(136, 19, 8, 1, 'No', 'Test 1', '2022-11-16', '2022-12-16', '30.00', '22.00', '5.00', '2150.00', '0.00', '2049.67', '0.00', '0.00', '7883.33', '9933.00', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 18:01:24', NULL),
(137, 19, 8, 1, 'No', 'Test 12', '2022-11-16', '2022-12-16', '30.00', '22.00', '3.00', '2000.00', '0.00', '1144.00', '0.00', '0.00', '4400.00', '5544.00', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-03 18:01:24', NULL),
(145, 20, 8, 1, 'Yes', 'Paul walker - ', '2022-11-16', '2022-12-16', '30.00', '22.00', '5.00', '500.00', '50.00', '214.00', '9.00', '179.76', '1783.33', '1817.57', 'Monthly | 2022-11-16 to 2022-11-16 | Working Days 22 Out Of 30 ', '2023-01-06 11:38:06', NULL),
(150, 22, 8, 1, 'No', 'Rachit', '2022-12-06', '2023-01-06', '31.00', '23.00', '1.00', '200.00', '0.00', '26.71', '0.00', '0.00', '148.39', '175.10', 'Monthly | 2022-12-06 to 2022-12-06 | Working Days 23 Out Of 31 ', '2023-01-11 10:45:13', NULL),
(151, 22, 8, 1, 'No', 'Richa', '2022-12-06', '2023-01-06', '31.00', '23.00', '1.00', '250.00', '0.00', '33.39', '0.00', '0.00', '185.48', '218.87', 'Monthly | 2022-12-06 to 2023-01-06 | Working Days 23 Out Of 31 ', '2023-01-11 10:45:13', NULL),
(164, 50, 11, 1, 'No', 'PHP Developer 30 Days', '2023-01-05', '2023-01-05', '1.00', '1.00', '130.00', '640.00', '0.00', '21632.00', '0.00', '0.00', '83200.00', '104832.00', 'Hourly  PHP Developer 30 Days', '2023-02-03 19:12:53', NULL),
(165, 50, 8, 1, 'No', 'Wordpress Developer', '2023-01-05', '2023-02-23', '50.00', '35.00', '1.00', '32000.00', '0.00', '5824.00', '0.00', '0.00', '22400.00', '28224.00', 'Monthly | 2023-01-05 to 2023-02-23 | Working Days 35 Out Of 50 ', '2023-02-03 19:12:53', NULL),
(166, 51, 12, 4, 'No', 'Test 1', '2023-02-16', '2023-03-15', '27.00', '19.00', '280.00', '1200.00', '0.00', '42560.00', '0.00', '0.00', '236444.44', '279004.44', 'Month | 2023-02-16 to 2023-03-15 | Working Days 19 Out Of 27 ', '2023-02-16 16:37:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_item_types`
--

CREATE TABLE `invoice_item_types` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `item_type_name` varchar(100) NOT NULL,
  `is_date` enum('Yes','No') NOT NULL DEFAULT 'No',
  `date_type` enum('days','months','years') DEFAULT 'days',
  `date_no` int(11) DEFAULT '1',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_item_types`
--

INSERT INTO `invoice_item_types` (`id`, `subscriber_id`, `item_type_name`, `is_date`, `date_type`, `date_no`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(8, 1, 'Monthly', 'Yes', 'months', 1, 'Active', 2, 2, '2022-10-07 15:51:36', '2022-10-31 16:47:09'),
(9, 1, 'Yearly', 'Yes', 'years', 1, 'Active', 2, 2, '2022-10-07 15:52:06', '2022-10-31 16:47:22'),
(10, 1, 'Daily', 'Yes', 'days', 1, 'Active', 2, 2, '2022-10-07 15:52:33', '2022-10-31 16:47:32'),
(11, 1, 'test', 'No', 'days', 1, 'Active', 2, NULL, '2022-11-29 14:32:09', NULL),
(12, 4, 'Month', 'Yes', 'months', 1, 'Active', 18, NULL, '2023-02-16 16:33:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_payments`
--

CREATE TABLE `invoice_payments` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_id` int(11) UNSIGNED NOT NULL,
  `payment_date` date NOT NULL,
  `reference_no` varchar(200) NOT NULL,
  `payment_source_id` int(11) UNSIGNED NOT NULL,
  `invoice_currency_amount` decimal(16,2) NOT NULL,
  `tds` decimal(16,2) NOT NULL,
  `currency_conversion_rate` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `company_currency_amount` decimal(16,2) NOT NULL,
  `difference_amount` decimal(16,2) NOT NULL,
  `amount_without_tax` decimal(16,2) NOT NULL DEFAULT '0.00',
  `subscriber_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `USD_ccr` decimal(16,6) NOT NULL DEFAULT '0.000000',
  `payment_status` enum('Loss','Profit','Remaining','Settled') NOT NULL,
  `status` enum('Bad Debt','Due','Paid','Partial') NOT NULL,
  `note` text,
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_payments`
--

INSERT INTO `invoice_payments` (`id`, `invoice_id`, `payment_date`, `reference_no`, `payment_source_id`, `invoice_currency_amount`, `tds`, `currency_conversion_rate`, `company_currency_amount`, `difference_amount`, `amount_without_tax`, `subscriber_ccr`, `USD_ccr`, `payment_status`, `status`, `note`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 20, '2022-11-09', '00000112', 4, '800.00', '901.08', '82.380000', '65000.00', '83648.92', '57992.95', '82.376352', '1.000000', 'Remaining', 'Partial', 'this is demo', 2, NULL, '2022-12-12 12:15:06', NULL),
(3, 22, '2022-12-28', '00000112', 4, '43.00', '2400.00', '82.648184', '30000.00', '15.00', '26568.00', '82.648184', '1.000000', 'Loss', 'Paid', 'this is demo', 2, NULL, '2023-01-10 10:20:47', NULL),
(6, 46, '2022-12-15', '00000112', 4, '735.53', '700.46', '82.140975', '59999.54', '0.00', '49774.00', '82.140975', '1.000000', 'Loss', 'Paid', 'sad', 2, NULL, '2023-01-10 12:43:28', NULL),
(9, 44, '2022-11-22', 'Bad Debt', 6, '0.00', '0.00', '82.140975', '0.00', '0.00', '0.00', '82.140975', '1.000000', 'Loss', 'Bad Debt', 'Bad Debt Invoice', 2, NULL, '2023-01-10 14:39:35', NULL),
(10, 50, '2023-01-13', '00000112', 4, '133056.00', '0.00', '81.398040', '11821900.87', '-6.00', '8748206.64', '81.398040', '1.000000', 'Profit', 'Paid', 'asdsa', 2, NULL, '2023-01-13 16:14:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoice_taxes`
--

CREATE TABLE `invoice_taxes` (
  `id` int(11) UNSIGNED NOT NULL,
  `invoice_id` int(11) UNSIGNED NOT NULL,
  `tax_id` int(11) UNSIGNED NOT NULL,
  `invoice_item_id` varchar(100) NOT NULL,
  `is_percentage` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `tax_rate` decimal(16,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(16,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `invoice_taxes`
--

INSERT INTO `invoice_taxes` (`id`, `invoice_id`, `tax_id`, `invoice_item_id`, `is_percentage`, `tax_rate`, `tax_amount`, `created_at`, `updated_at`) VALUES
(132, 46, 3, '124', 'Yes', '18.00', '112.20', '2023-01-03 11:30:35', NULL),
(133, 47, 5, '125', 'Yes', '12.00', '214.00', '2023-01-03 11:30:39', NULL),
(138, 44, 5, '131', 'Yes', '12.00', '214.00', '2023-01-03 12:59:24', NULL),
(139, 23, 3, '132,133', 'Yes', '18.00', '193.86', '2023-01-03 17:56:01', NULL),
(140, 23, 4, '132,133', 'Yes', '8.00', '86.16', '2023-01-03 17:56:01', NULL),
(141, 48, 3, '134,135', 'Yes', '18.00', '2211.00', '2023-01-03 17:58:37', NULL),
(142, 48, 4, '134,135', 'Yes', '8.00', '982.67', '2023-01-03 17:58:37', NULL),
(143, 19, 3, '136,137', 'Yes', '18.00', '2211.00', '2023-01-03 18:01:24', NULL),
(144, 19, 4, '136,137', 'Yes', '8.00', '982.67', '2023-01-03 18:01:24', NULL),
(152, 20, 5, '145', 'Yes', '12.00', '214.00', '2023-01-06 11:38:06', NULL),
(155, 22, 3, '150,151', 'Yes', '18.00', '60.10', '2023-01-11 10:45:13', NULL),
(168, 50, 3, '164,165', 'Yes', '18.00', '19008.00', '2023-02-03 19:12:53', NULL),
(169, 50, 4, '164,165', 'Yes', '8.00', '8448.00', '2023-02-03 19:12:53', NULL),
(170, 51, 3, '166', 'Yes', '18.00', '42560.00', '2023-02-16 16:37:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
(55, '2022-07-28-095031', 'App\\Database\\Migrations\\Country', 'default', 'App', 1664788002, 1),
(56, '2022-07-28-095649', 'App\\Database\\Migrations\\Currency', 'default', 'App', 1664788002, 1),
(57, '2022-07-28-100049', 'App\\Database\\Migrations\\Subscriber', 'default', 'App', 1664788002, 1),
(58, '2022-08-04-091547', 'App\\Database\\Migrations\\Permission', 'default', 'App', 1664788002, 1),
(59, '2022-08-08-052352', 'App\\Database\\Migrations\\Restriction', 'default', 'App', 1664788003, 1),
(60, '2022-08-09-073934', 'App\\Database\\Migrations\\PermissionGroup', 'default', 'App', 1664788003, 1),
(61, '2022-08-10-050348', 'App\\Database\\Migrations\\AddRole', 'default', 'App', 1664788003, 1),
(62, '2022-09-28-100702', 'App\\Database\\Migrations\\User', 'default', 'App', 1664788003, 1),
(63, '2022-09-28-103622', 'App\\Database\\Migrations\\AppToken', 'default', 'App', 1664788003, 1),
(64, '2022-10-03-114300', 'App\\Database\\Migrations\\CountryTaxes', 'default', 'App', 1664798271, 2),
(66, '2022-10-06-045339', 'App\\Database\\Migrations\\PaymentSource', 'default', 'App', 1665033121, 3),
(67, '2022-10-07-051521', 'App\\Database\\Migrations\\InvoiceItemType', 'default', 'App', 1665126770, 4),
(68, '2022-10-07-110517', 'App\\Database\\Migrations\\SourcePlatform', 'default', 'App', 1665140784, 5),
(69, '2022-10-07-114733', 'App\\Database\\Migrations\\ClientGroup', 'default', 'App', 1665143373, 6),
(70, '2022-10-10-065342', 'App\\Database\\Migrations\\Client', 'default', 'App', 1665393172, 7),
(71, '2022-10-11-044737', 'App\\Database\\Migrations\\Company', 'default', 'App', 1665467660, 8),
(72, '2022-10-12-112431', 'App\\Database\\Migrations\\CompanyFinancialYear', 'default', 'App', 1665653470, 9),
(73, '2022-10-14-072031', 'App\\Database\\Migrations\\CompanyClient', 'default', 'App', 1665732706, 10),
(74, '2022-10-18-101409', 'App\\Database\\Migrations\\CompanyUser', 'default', 'App', 1665992917, 11),
(75, '2022-10-20-120551', 'App\\Database\\Migrations\\CompanySetting', 'default', 'App', 1666333750, 12),
(81, '2022-11-01-103353', 'App\\Database\\Migrations\\Invoice', 'default', 'App', 1667305918, 13),
(83, '2022-11-03-090619', 'App\\Database\\Migrations\\InvoiceItem', 'default', 'App', 1667797019, 14),
(85, '2022-11-07-061313', 'App\\Database\\Migrations\\InvoiceTax', 'default', 'App', 1667803246, 15),
(86, '2022-11-10-064916', 'App\\Database\\Migrations\\EmailConfigration', 'default', 'App', 1668065622, 16),
(88, '2022-11-10-071736', 'App\\Database\\Migrations\\PaymentTerm', 'default', 'App', 1668414900, 17),
(89, '2022-11-15-101418', 'App\\Database\\Migrations\\InvoiceAttachment', 'default', 'App', 1668507633, 18),
(90, '2022-11-17-093142', 'App\\Database\\Migrations\\InvoicePayment', 'default', 'App', 1668835909, 19),
(91, '2022-11-23-052119', 'App\\Database\\Migrations\\ContributionRatio', 'default', 'App', 1669181295, 20),
(92, '2022-11-23-064858', 'App\\Database\\Migrations\\ClientContributedUser', 'default', 'App', 1669186167, 21),
(93, '2022-11-28-052338', 'App\\Database\\Migrations\\UserContribution', 'default', 'App', 1669613454, 22),
(94, '2022-11-28-052511', 'App\\Database\\Migrations\\ContributionSlabs', 'default', 'App', 1669613455, 22),
(96, '2022-12-04-090401', 'App\\Database\\Migrations\\ExpenseCategory', 'default', 'App', 1670404055, 23),
(97, '2022-12-05-075711', 'App\\Database\\Migrations\\Expenses', 'default', 'App', 1670404055, 23),
(98, '2022-12-25-105632', 'App\\Database\\Migrations\\CompanyBank', 'default', 'App', 1672044624, 24),
(99, '2022-12-25-105643', 'App\\Database\\Migrations\\BankField', 'default', 'App', 1672044624, 24),
(100, '2022-12-26-054846', 'App\\Database\\Migrations\\InvoiceBank', 'default', 'App', 1672044624, 24),
(102, '2022-10-10-066826', 'App\\Database\\Migrations\\Contributor', 'default', 'App', 1675227777, 26),
(103, '2022-11-14-071727', 'App\\Database\\Migrations\\DocumentTypes', 'default', 'App', 1675227892, 27),
(104, '2022-10-09-066826', 'App\\Database\\Migrations\\Contributor', 'default', 'App', 1676608637, 28),
(106, '2023-02-17-043517', 'App\\Database\\Migrations\\IncomeCategory', 'default', 'App', 1676610481, 29),
(107, '2023-02-17-052225', 'App\\Database\\Migrations\\Income', 'default', 'App', 1676611419, 30);

-- --------------------------------------------------------

--
-- Table structure for table `payment_sources`
--

CREATE TABLE `payment_sources` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `payment_source_name` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_sources`
--

INSERT INTO `payment_sources` (`id`, `subscriber_id`, `payment_source_name`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(4, 1, 'Paypal', 'Active', 2, 2, '2022-10-06 18:21:01', '2022-10-07 15:42:08'),
(5, 1, 'UPI', 'Active', 2, NULL, '2022-10-06 18:21:11', NULL),
(6, 1, 'Bank Transaction', 'Active', 2, 2, '2022-10-07 18:10:41', '2022-10-14 13:30:17');

-- --------------------------------------------------------

--
-- Table structure for table `payment_terms`
--

CREATE TABLE `payment_terms` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `company_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED NOT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_terms`
--

INSERT INTO `payment_terms` (`id`, `subscriber_id`, `company_id`, `title`, `description`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Payment Terms', '<p class=\"ql-align-justify\">1. Payment Terms And Conditions</p><p class=\"ql-align-justify\">These are the terms related to payment in case of credit invoices. Credit invoices are invoices for which the amount is not received in advance or in cash at the time of issue of invoice but will be received afterwards.</p><p class=\"ql-align-justify\">It is important to add payment terms if there is no separate agreement between the buyer and seller. Even if there is an agreement between the seller and buyer, it is a good practice to write the due date on each invoice, as it will help the buyer to be aware of the due date.</p><p class=\"ql-align-justify\">We recommend writing the due date on the invoice rather than using confusing abbreviations like Net 7.</p><p class=\"ql-align-justify\">Some of the abbreviations used in payment terms are</p><ol><li>Net 7 – Payment due in 7 days from invoice date</li><li>Net 10 – Payment due in 10 days from invoice date</li><li>Net 30 – Payment due in 30 days from invoice date</li><li>Net 60 – Payment due in 60 days from invoice date</li><li>Net 90 – Payment due in 90 days from invoice date</li><li>COD – Cash on Delivery</li><li>CIA – Cash in Advance</li><li>PIA – Payment in Advance</li><li>1% 10 Net 30 – Customer is eligible for 1% discount if payment is received within 10 days. Full payment is required after 10 days and the overall due date is 30 days from the invoice date</li><li>Contra Payment – Payment from customer being offset against supplies purchased from customer</li></ol><p class=\"ql-align-justify\">Other than the due date, it is also important to write all modes of payment available and their details like bank details, UPI address or clickable links in case of PDF invoices.</p><p class=\"ql-align-justify\">Also, write the consequences if the payment is not made in time like interest or fixed charges payable. Or if the party purchases on regular basis then it can be written that further deliver of goods/services will be immediately stopped.</p><p class=\"ql-align-justify\">Also Read – <a href=\"https://taxadda.com/gst-invoicing-format-requirements/\" rel=\"noopener noreferrer\" target=\"_blank\">Invoicing under GST</a></p><h2 class=\"ql-align-justify\">2. <strong>Warranty Related Terms And Conditions</strong></h2><p class=\"ql-align-justify\">If you are selling products that carries a warranty, it is a good practice to write all terms and conditions. The below points should be clearly mentioned</p><ul><li>Period of warranty</li><li>Person who is giving the warranty. You are providing the warranty or the original manufacturer is providing it.</li><li>Contact details. In case, a third party should be contacted, his details. For example, in electronics company provides the warranty and company’s service centre needs to be contacted and not the actual seller.</li><li>Warrant is on site or not. In case of goods which are fixed like house fittings or bulky like a refrigerator, whether service person visits the place or person has to bring it to service centre.</li></ul><h2 class=\"ql-align-justify\">3. <strong>Returns/Refund Related Terms</strong></h2><p class=\"ql-align-justify\">It is good to be mentioned in which cases a refund is allowed. In case of goods, if returns/exchange are allowed and if allowed then on which conditions and up to which time limit. For example, it can be mentioned that goods should be in same condition and with packaging intact.</p><p class=\"ql-align-justify\">In case of software and online services subscription, it is a general practice to provide limited time money back guarantee. In such cases, what will be the terms and how the refund will be processed.</p><p class=\"ql-align-justify\">Also Read – <a href=\"https://taxadda.com/meaning-of-debit-note-and-credit-note/\" rel=\"noopener noreferrer\" target=\"_blank\">Credit notes and debit notes under GST</a></p><h2 class=\"ql-align-justify\">4. <strong>Where Is The Legal Jurisdiction</strong></h2><p class=\"ql-align-justify\">In case of small businesses, it is better to write whether in case of dispute where is the legal jurisdiction. So that in case of any legal dispute, business can manage the dispute in their local courts. You will find this written in many invoices – Subject to Delhi Jurisdiction only.</p><h2 class=\"ql-align-justify\">5. <strong>E &amp; O.E</strong></h2><p class=\"ql-align-justify\">Errors and omissions excepted&nbsp;(E&amp;OE) is a phrase used in an attempt to reduce&nbsp;legal liability&nbsp;for potentially incorrect or incomplete information supplied in a contractually related document such as a quotation or specification. It means that if any error or omission is found later in the invoice, it can be rectified with suitable adjustments.</p>', 'Active', 5, 2, '2022-11-15 10:03:23', '2022-12-27 15:16:51'),
(2, 1, 3, 'TBS', '<p class=\"ql-align-justify\">1. Payment Terms And Conditions</p><p class=\"ql-align-justify\">These are the terms related to payment in case of credit invoices. Credit invoices are invoices for which the amount is not received in advance or in cash at the time of issue of invoice but will be received afterwards.</p><p class=\"ql-align-justify\">It is essential to add payment terms if there is no separate agreement between the buyer and seller. Even if there is an agreement between the seller and buyer, it is a good practice to write the due date on each invoice, as it will help the buyer to be aware of the due date.</p><p class=\"ql-align-justify\">We recommend writing the due date on the invoice rather than using confusing abbreviations like Net 7.</p><p class=\"ql-align-justify\">Some of the abbreviations used in payment terms are</p><ol><li>Net 7 – Payment due in 7 days from invoice date</li><li>Net 10 – Payment due in 10 days from invoice date</li><li>Net 30 – Payment due in 30 days from invoice date</li><li>Net 60 – Payment due in 60 days from invoice date</li><li>Net 90 – Payment due in 90 days from invoice date</li><li>COD – Cash on Delivery</li><li>CIA – Cash in Advance</li><li>PIA – Payment in Advance</li><li>1% 10 Net 30 – Customer is eligible for a 1% discount if payment is received within 10 days. Full payment is required after 10 days and the overall due date is 30 days from the invoice date</li><li>Contra Payment – Payment from the customer being offset against supplies purchased from the customer</li></ol><p class=\"ql-align-justify\">Other than the due date, it is also important to write all modes of payment available and their details like bank details, UPI address or clickable links in case of PDF invoices.</p><p class=\"ql-align-justify\">Also, write the consequences if the payment is not made in time like interest or fixed charges payable. Or if the party purchases on a regular basis then it can be written that further delivery of goods/services will be immediately stopped.</p><p class=\"ql-align-justify\">Also, Read – <a href=\"https://taxadda.com/gst-invoicing-format-requirements/\" rel=\"noopener noreferrer\" target=\"_blank\">Invoicing under GST</a></p><h2><br></h2>', 'Active', 2, 2, '2022-12-27 15:03:57', '2022-12-27 15:22:36');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `is_default` enum('Yes','No') NOT NULL DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `slug`, `url`, `is_default`) VALUES
(1, 'Dashboard', 'dashboard', '/dashboard', 'Yes'),
(2, 'Subscriber', 'subscriber', '/subscriber', 'No'),
(3, 'Invoice', 'invoice', '/invoice', 'No'),
(4, 'Client', 'client', '/client', 'No'),
(5, 'Company', 'company', '/company', 'No'),
(6, 'Contribution', 'contribution', '/contribution', 'No'),
(7, 'Expenses', 'expenses', '/expenses', 'No'),
(8, 'Profit Loss Report', 'profit-loss', '/reports/profit-loss', 'No'),
(9, 'Income Statement Report', 'income-statement', '/reports/income-statement', 'No'),
(10, 'User', 'user', '/user', 'No'),
(11, 'Role', 'role', '/role-permission/role', 'No'),
(12, 'Permission List', 'permission-list', '/role-permission/permission/permission-list', 'No'),
(13, 'Permission Group', 'permission-group', '/role-permission/permission/permission-group', 'No'),
(14, 'Restriction', 'restriction', '/role-permission/restriction', 'No'),
(15, 'Country', 'country', '/settings/country', 'No'),
(16, 'Currency', 'currency', '/settings/currency', 'No'),
(17, 'Country Tax', 'country-tax', '/settings/country-tax', 'No'),
(18, 'Client Group', 'client-group', '/settings/client-group', 'No'),
(19, 'Source Platform', 'source-platform', '/settings/source-platform', 'No'),
(20, 'Company Financial Year', 'company-financial-year', '/settings/company-financial-year', 'No'),
(21, 'Invoice Terms', 'invoice-terms', '/settings/invoice-terms', 'No'),
(22, 'Invoice Item Type', 'invoice-item-type', '/settings/invoice-item-type', 'No'),
(23, 'Payment Source', 'payment-source', '/settings/payment-source', 'No'),
(24, 'Expense Category', 'expense-category', '/settings/expense-category', 'No'),
(25, 'Company Bank Details', 'company-bank-details', '/settings/company-bank-details', 'No'),
(26, 'Document Type', 'document-type', '/settings/document-type', 'No'),
(27, 'Expense Statement Report', 'expense-statement', '/reports/expense-statement', 'No'),
(28, 'Contributor', 'contributor', '/settings/contributor', 'No'),
(29, 'Year over Year Report', 'yoy-report', '/reports/yoy-report', 'No'),
(30, 'Incomes', 'income', '/income', 'No'),
(31, 'Income Category', 'income-category', '/settings/income-category', 'No'),
(32, 'Client Report', 'client-report', '/reports/client-report', 'No');

-- --------------------------------------------------------

--
-- Table structure for table `permission_group`
--

CREATE TABLE `permission_group` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `permissions` text,
  `restrictions` text,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `permission_group`
--

INSERT INTO `permission_group` (`id`, `name`, `description`, `permissions`, `restrictions`, `subscriber_id`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin Group', 'This is super admin permission group', '1,2,10,11,12,13,14,15,16,17', '1,2,3,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41', NULL, '2022-12-14 16:06:55', NULL),
(2, 'Subscriber Group', 'This is subscriber permission group', '1,3,4,5,6,7,8,9,10,11,13,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32', '4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,72,73,74,69,70,71', NULL, '2022-12-14 16:06:55', '2023-03-27 10:31:29'),
(3, 'User Group', 'This is demo', '1,4,5', '13,14,15,16,17,18,19,20', 1, '2022-12-16 16:39:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `restrictions`
--

CREATE TABLE `restrictions` (
  `id` int(11) UNSIGNED NOT NULL,
  `permission_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `restrictions`
--

INSERT INTO `restrictions` (`id`, `permission_id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 2, 'Can add subscriber', 'CAN_ADD_SUBSCRIBER', 'Can add subscriber', '2022-12-14 16:06:23', NULL),
(2, 2, 'Can edit subscriber', 'CAN_EDIT_SUBSCRIBER', 'Can edit subscriber', '2022-12-14 16:06:23', NULL),
(3, 2, 'Can delete subscriber', 'CAN_DELETE_SUBSCRIBER', 'Can delete subscriber', '2022-12-14 16:06:23', NULL),
(4, 3, 'Can add invoice', 'CAN_ADD_INVOICE', 'Can add invoice', '2022-12-14 16:06:23', NULL),
(5, 3, 'Can edit invoice', 'CAN_EDIT_INVOICE', 'Can edit invoice', '2022-12-14 16:06:23', NULL),
(6, 3, 'Can delete invoice', 'CAN_DELETE_INVOICE', 'Can delete invoice', '2022-12-14 16:06:23', NULL),
(7, 3, 'Can view invoice', 'CAN_VIEW_INVOICE', 'Can view invoice', '2022-12-14 16:06:23', NULL),
(8, 3, 'Can download Invoice', 'CAN_DOWNLOAD_INVOICE', 'Can download Invoice', '2022-12-14 16:06:23', NULL),
(9, 3, 'Can add Invoice attachment', 'CAN_ADD_INVOICE_ATTACHMENT', 'Can add Invoice attachment', '2022-12-14 16:06:23', NULL),
(10, 3, 'Can delete invoice attachment', 'CAN_DELETE_INVOICE_ATTACHMENT', 'Can delete invoice attachment', '2022-12-14 16:06:23', NULL),
(11, 3, 'Can download invoice attachment', 'CAN_DOWNLOAD_INVOICE_ATTACHMENT', 'Can download invoice attachment', '2022-12-14 16:06:23', NULL),
(12, 3, 'Can download invoice all attachment', 'CAN_DOWNLOAD_INVOICE_ALL_ATTACHMENT', 'Can download invoice attachment', '2022-12-14 16:06:23', NULL),
(13, 4, 'Can add client', 'CAN_ADD_CLIENT', 'Can add client', '2022-12-14 16:06:23', NULL),
(14, 4, 'Can edit client', 'CAN_EDIT_CLIENT', 'Can edit client', '2022-12-14 16:06:23', NULL),
(15, 4, 'Can delete client', 'CAN_DELETE_CLIENT', 'Can delete client', '2022-12-14 16:06:23', NULL),
(16, 5, 'Can add company', 'CAN_ADD_COMPANY', 'Can add company', '2022-12-14 16:06:23', NULL),
(17, 5, 'Can edit company', 'CAN_EDIT_COMPANY', 'Can edit company', '2022-12-14 16:06:23', NULL),
(18, 5, 'Can delete company', 'CAN_DELETE_COMPANY', 'Can delete company', '2022-12-14 16:06:23', NULL),
(19, 5, 'Can change company setting', 'CAN_COMPANY_SETTING', 'Can change company setting', '2022-12-14 16:06:23', NULL),
(20, 5, 'Can change company email configuration', 'CAN_COMPANY_EMAIL_CONFIGURATION', 'Can change company email cofiguration', '2022-12-14 16:06:23', NULL),
(21, 7, 'Can Add Expenses', 'CAN_ADD_EXPENSES', 'Can Add Expenses', '2022-12-14 16:06:23', NULL),
(22, 7, 'Can Edit Expenses', 'CAN_EDIT_EXPENSES', 'Can Edit Expenses', '2022-12-14 16:06:23', NULL),
(23, 7, 'Can Delete Expenses', 'CAN_DELETE_EXPENSES', 'Can Delete Expenses', '2022-12-14 16:06:23', NULL),
(24, 10, 'Can Add User', 'CAN_ADD_USER', 'Can Add User', '2022-12-14 16:06:23', NULL),
(25, 10, 'Can Add User', 'CAN_EDIT_USER', 'Can Add User', '2022-12-14 16:06:23', NULL),
(26, 10, 'Can Add User', 'CAN_DELETE_USER', 'Can Add User', '2022-12-14 16:06:23', NULL),
(27, 11, 'Can add role', 'CAN_ADD_ROLE', 'Can add role', '2022-12-14 16:06:23', NULL),
(28, 11, 'Can edit role', 'CAN_EDIT_ROLE', 'Can edit role', '2022-12-14 16:06:23', NULL),
(29, 11, 'Can delete role', 'CAN_DELETE_ROLE', 'Can delete role', '2022-12-14 16:06:23', NULL),
(30, 13, 'Can add permission group', 'CAN_ADD_PERMISSION_GROUP', 'Can add permission group', '2022-12-14 16:06:23', NULL),
(31, 13, 'Can edit Permission group', 'CAN_EDIT_PERMISSION_GROUP', 'Can edit permission group', '2022-12-14 16:06:23', NULL),
(32, 13, 'Can delete permission group', 'CAN_DELETE_PERMISSION_GROUP', 'Can delete permission group', '2022-12-14 16:06:23', NULL),
(33, 15, 'Can Add Country', 'CAN_ADD_COUNTRY', 'Can Add Country', '2022-12-14 16:06:23', NULL),
(34, 15, 'Can Edit Country', 'CAN_EDIT_COUNTRY', 'Can Edit Country', '2022-12-14 16:06:23', NULL),
(35, 15, 'Can Delete Country', 'CAN_DELETE_COUNTRY', 'Can Delete Country', '2022-12-14 16:06:23', NULL),
(36, 16, 'Can Add Currency', 'CAN_ADD_CURRENCY', 'Can Add Currency', '2022-12-14 16:06:23', NULL),
(37, 16, 'Can Edit Currency', 'CAN_EDIT_CURRENCY', 'Can Edit Currency', '2022-12-14 16:06:23', NULL),
(38, 16, 'Can Delete Currency', 'CAN_DELETE_CURRENCY', 'Can Delete Currency', '2022-12-14 16:06:23', NULL),
(39, 17, 'Can Add Country Tax', 'CAN_ADD_COUNTRY_TAX', 'Can Add Country Tax', '2022-12-14 16:06:23', NULL),
(40, 17, 'Can Edit Country Tax', 'CAN_EDIT_COUNTRY_TAX', 'Can Edit Country Tax', '2022-12-14 16:06:23', NULL),
(41, 17, 'Can Delete Country Tax', 'CAN_DELETE_COUNTRY_TAX', 'Can Delete Country Tax', '2022-12-14 16:06:23', NULL),
(42, 18, 'Can Add Client Group', 'CAN_ADD_CLIENT_GROUP', 'Can Add Client Group', '2022-12-14 16:06:23', NULL),
(43, 18, 'Can Edit Client Group', 'CAN_EDIT_CLIENT_GROUP', 'Can Edit Client Group', '2022-12-14 16:06:23', NULL),
(44, 18, 'Can Delete Client Group', 'CAN_DELETE_CLIENT_GROUP', 'Can Delete Client Group', '2022-12-14 16:06:23', NULL),
(45, 19, 'Can Add Source Platform', 'CAN_ADD_SOURCE_PLATFORM', 'Can Add Source Platform', '2022-12-14 16:06:23', NULL),
(46, 19, 'Can Edit Source Platform', 'CAN_EDIT_SOURCE_PLATFORM', 'Can Edit Source Platform', '2022-12-14 16:06:23', NULL),
(47, 19, 'Can Delete Source Platform', 'CAN_DELETE_SOURCE_PLATFORM', 'Can Delete Source Platform', '2022-12-14 16:06:23', NULL),
(48, 20, 'Can Add Company Financial Year', 'CAN_ADD_COMPANY_FINANCIAL_YEAR', 'Can Add Company Financial Year', '2022-12-14 16:06:23', NULL),
(49, 20, 'Can Edit Company Financial Year', 'CAN_EDIT_COMPANY_FINANCIAL_YEAR', 'Can Edit Company Financial Year', '2022-12-14 16:06:23', NULL),
(50, 20, 'Can Delete Company Financial Year', 'CAN_DELETE_COMPANY_FINANCIAL_YEAR', 'Can Delete Company Financial Year', '2022-12-14 16:06:23', NULL),
(51, 21, 'Can add Terms', 'CAN_ADD_TERMS', 'Can add Terms', '2022-12-14 16:06:23', NULL),
(52, 21, 'Can Edit Terms', 'CAN_EDIT_TERMS', 'Can Edit Terms', '2022-12-14 16:06:23', NULL),
(53, 21, 'Can Delete Terms', 'CAN_DELETE_TERMS', 'Can Delete Terms', '2022-12-14 16:06:23', NULL),
(54, 22, 'Can Add Invoice Item Type', 'CAN_ADD_INVOICE_ITEM_TYPE', 'Can Add Invoice Item Type', '2022-12-14 16:06:23', NULL),
(55, 22, 'Can Edit Invoice Item Type', 'CAN_EDIT_INVOICE_ITEM_TYPE', 'Can Edit Invoice Item Type', '2022-12-14 16:06:23', NULL),
(56, 22, 'Can Delete Invoice Item Type', 'CAN_DELETE_INVOICE_ITEM_TYPE', 'Can Delete Invoice Item Type', '2022-12-14 16:06:23', NULL),
(57, 23, 'Can Add Payment Source', 'CAN_ADD_PAYMENT_SOURCE', 'Can Add Payment Source', '2022-12-14 16:06:23', NULL),
(58, 23, 'Can Edit Payment Source', 'CAN_EDIT_PAYMENT_SOURCE', 'Can Edit Payment Source', '2022-12-14 16:06:23', NULL),
(59, 23, 'Can Delete Payment Source', 'CAN_DELETE_PAYMENT_SOURCE', 'Can Delete Payment Source', '2022-12-14 16:06:23', NULL),
(60, 24, 'Can add Terms', 'CAN_ADD_EXPENSE_CATEGORY', 'Can add Terms', '2022-12-14 16:06:23', NULL),
(61, 24, 'Can Edit Terms', 'CAN_EDIT_EXPENSE_CATEGORY', 'Can Edit Terms', '2022-12-14 16:06:23', NULL),
(62, 24, 'Can Delete Terms', 'CAN_DELETE_EXPENSE_CATEGORY', 'Can Delete Terms', '2022-12-14 16:06:23', NULL),
(63, 25, 'Can Add Company Bank Details', 'CAN_ADD_COMPANY_BANK_DETAILS', 'Can Add Company Bank Details', '2022-12-26 11:15:12', NULL),
(64, 25, 'Can Edit Company Bank Details', 'CAN_EDIT_COMPANY_BANK_DETAILS', 'Can Edit Company Bank Details', '2022-12-26 11:15:53', NULL),
(65, 25, 'Can Delete Company Bank Details', 'CAN_DELETE_COMPANY_BANK_DETAILS', 'Can Delete Company Bank Details', '2022-12-26 11:16:51', NULL),
(66, 28, 'Can Add Contributor', 'CAN_ADD_CONTRIBUTOR', 'Can Add Contributor', '2023-01-13 11:31:02', NULL),
(67, 28, 'Can Edit Contributor', 'CAN_EDIT_CONTRIBUTOR', 'Can Edit Contributor', '2023-01-13 11:31:27', NULL),
(68, 28, 'Can Delete Contributor', 'CAN_DELETE_CONTRIBUTOR', 'Can Delete Contributor', '2023-01-13 11:31:56', NULL),
(69, 31, 'Can add income category', 'CAN_ADD_INCOME_CATEGORY', 'Can add income category', '2023-02-17 10:09:20', NULL),
(70, 31, 'Can edit income category', 'CAN_EDIT_INCOME_CATEGORY', 'Can edit income category', '2023-02-17 10:09:47', NULL),
(71, 31, 'Can delete income category', 'CAN_DELETE_INCOME_CATEGORY', 'Can delete income category', '2023-02-17 10:10:19', NULL),
(72, 30, 'Can add incomes', 'CAN_ADD_INCOMES', 'Can add incomes', '2023-02-17 11:19:22', NULL),
(73, 30, 'Can edit incomes', 'CAN_EDIT_INCOMES', 'Can edit incomes', '2023-02-17 11:19:50', NULL),
(74, 30, 'Can delete incomes', 'CAN_DELETE_INCOMES', 'Can delete incomes', '2023-02-17 11:20:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `group_id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `can_delete` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `group_id`, `subscriber_id`, `can_delete`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 1, NULL, 'No', 'Active', '2022-10-03 14:36:47', NULL),
(2, 'Subscriber', 2, NULL, 'No', 'Active', '2022-10-03 14:36:47', NULL),
(3, 'User', 3, 1, 'Yes', 'Active', '2022-10-03 14:40:19', '2022-12-16 16:39:49');

-- --------------------------------------------------------

--
-- Table structure for table `source_platforms`
--

CREATE TABLE `source_platforms` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `platform_name` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `source_platforms`
--

INSERT INTO `source_platforms` (`id`, `subscriber_id`, `platform_name`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(2, 1, 'Upwork', 'Active', 2, 2, '2022-10-10 14:46:27', '2022-10-10 14:48:21'),
(3, 1, 'LinkedIn', 'Active', 2, NULL, '2022-10-11 15:23:29', NULL),
(4, 4, 'Upwork', 'Active', 18, NULL, '2023-02-16 16:33:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int(11) UNSIGNED NOT NULL,
  `official_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `address_1` varchar(255) NOT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `zipcode` varchar(100) NOT NULL,
  `country_id` int(11) UNSIGNED NOT NULL,
  `currency_id` int(11) UNSIGNED NOT NULL,
  `financial_start_date` date DEFAULT NULL,
  `financial_end_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `official_name`, `first_name`, `last_name`, `email`, `phone`, `logo`, `address_1`, `address_2`, `city`, `state`, `zipcode`, `country_id`, `currency_id`, `financial_start_date`, `financial_end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Technobrains Business Solution', 'Bhavik', 'Shah', 'info@technobrain.com', '1234567885', NULL, '519 ISCON Emporio, Nr. Jodhpur Cross Road, ​Ahmedabad', '', 'Ahmedabad', 'Gujarat', '380015', 1, 1, '2022-04-01', '2023-03-31', 'Active', '2022-10-03 14:37:21', '2023-01-17 10:10:36'),
(3, 'I Mindtack', 'Parth', 'Makadia', 'tbs.parth@gmail.com', '9724699232', '1673932623_1673932623_5ba6f508a1a61196d183.png', 'Jodhpur Char Rasta', 'Address Line 2', 'Ahmedabad', 'Gujarat', '380015', 1, 1, '2022-04-01', '2023-03-31', 'Active', '2022-12-21 12:40:42', '2023-01-17 10:47:03'),
(4, 'PavTeach', 'Parth', 'Makadiya', 'parthmakadiya1798@gmail.com', '9876543201', '1676540851_1676540851_6bf613405d7d3531d917.png', 'Ahmedabad', '', 'Ahmedabad', 'Gujarat', '360-450', 1, 1, '2022-04-01', '2023-03-31', 'Active', '2023-02-16 15:17:31', '2023-02-16 16:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `user_type` enum('SuperAdmin','Subscriber','Client','User') DEFAULT NULL,
  `role_id` int(11) UNSIGNED NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_by` int(11) UNSIGNED DEFAULT NULL,
  `updated_by` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `subscriber_id`, `first_name`, `last_name`, `username`, `email`, `password`, `phone`, `user_type`, `role_id`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Super', 'Admin', 'superadmin', 'admin@gmail.com', '$2y$10$y5kT7/fQTAQtG2mrYYw30OmK3.X6oKndwhiBTaHyY9o88nk11V0tq', '1234567890', 'SuperAdmin', 1, 'Active', NULL, NULL, '2022-10-03 14:36:47', NULL),
(2, 1, 'Bhavik', 'Shah', NULL, 'info@technobrain.com', '$2y$10$SJ.w8npwHUV6AfFVMr460OFxm4NBlAUWQHp29dols7aIfPMyWE4Lm', '1234567885', 'Subscriber', 2, 'Active', 1, 1, '2022-10-03 14:37:21', '2023-01-17 10:10:36'),
(5, 1, 'User', 'Shah', NULL, 'bshah@technobrains.com', '$2y$10$HEUS88LCWCEix0t70VvEdOfk.4Bta7dwYvlfZRtrzr3mW5gJsN1Sy', '1234567890', 'User', 3, 'Active', 2, 2, '2022-10-03 15:27:13', '2023-02-06 15:38:18'),
(9, 1, 'Rohit', 'Jayswal', NULL, 'tbs.rohitj@gmail.com', '$2y$10$pcXCPCS5cnSYy8JAOGjR8e3fSuRIL5SyfHTYMZvDu8UUEbTV0Dknu', '1234567890', 'User', 3, 'Active', 2, 2, '2022-10-18 16:30:20', '2022-12-26 13:00:49'),
(17, 3, 'Parth', 'Makadia', NULL, 'tbs.parth@gmail.com', '$2y$10$AY978kHCpdr3r8zrqKtgvuyxlG8oOJUQuU64Jd8uCnL6aD2oBjJD2', '9724699232', 'Subscriber', 2, 'Active', 1, 1, '2022-12-21 12:40:42', '2023-01-17 10:47:03'),
(18, 4, 'Parth', 'Makadiya', NULL, 'parthmakadiya1798@gmail.com', '$2y$10$A7Vc9dhUqv1kx4RnqgpIDOwJVNndwkfT8sZXFTGs7ssBk2hWbj4iG', '9876543201', 'Subscriber', 2, 'Active', 1, 1, '2023-02-16 15:17:31', '2023-02-16 16:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `user_contributions`
--

CREATE TABLE `user_contributions` (
  `id` int(11) UNSIGNED NOT NULL,
  `subscriber_id` int(11) UNSIGNED NOT NULL,
  `contributor_id` int(11) UNSIGNED NOT NULL,
  `roll_over_month` int(11) DEFAULT NULL,
  `roll_over_bill` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_contributions`
--

INSERT INTO `user_contributions` (`id`, `subscriber_id`, `contributor_id`, `roll_over_month`, `roll_over_bill`) VALUES
(12, 1, 2, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_token`
--
ALTER TABLE `app_token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_token_user_id_foreign` (`user_id`);

--
-- Indexes for table `bank_fields`
--
ALTER TABLE `bank_fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_fields_company_bank_id_foreign` (`company_bank_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clients_country_id_foreign` (`country_id`),
  ADD KEY `clients_source_by_foreign` (`source_by`),
  ADD KEY `clients_created_by_foreign` (`created_by`),
  ADD KEY `clients_updated_by_foreign` (`updated_by`),
  ADD KEY `clients_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `clients_client_group_id_foreign` (`client_group_id`),
  ADD KEY `clients_source_from_foreign` (`source_from`);

--
-- Indexes for table `client_contributed_user`
--
ALTER TABLE `client_contributed_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_contributed_user_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `client_contributed_user_client_id_foreign` (`client_id`),
  ADD KEY `client_contributed_user_user_id_foreign` (`contributor_id`);

--
-- Indexes for table `client_groups`
--
ALTER TABLE `client_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_groups_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `client_groups_created_by_foreign` (`created_by`),
  ADD KEY `client_groups_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `companies_created_by_foreign` (`created_by`),
  ADD KEY `companies_updated_by_foreign` (`updated_by`),
  ADD KEY `companies_country_id_foreign` (`country_id`),
  ADD KEY `companies_currency_id_foreign` (`currency_id`);

--
-- Indexes for table `company_banks`
--
ALTER TABLE `company_banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_banks_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `company_banks_company_id_foreign` (`company_id`),
  ADD KEY `company_banks_created_by_foreign` (`created_by`),
  ADD KEY `company_banks_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `company_clients`
--
ALTER TABLE `company_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_clients_client_id_foreign` (`client_id`),
  ADD KEY `company_clients_created_by_foreign` (`created_by`),
  ADD KEY `company_clients_updated_by_foreign` (`updated_by`),
  ADD KEY `company_clients_company_id_foreign` (`company_id`);

--
-- Indexes for table `company_financial_years`
--
ALTER TABLE `company_financial_years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_financial_years_company_id_foreign` (`company_id`),
  ADD KEY `company_financial_years_created_by_foreign` (`created_by`),
  ADD KEY `company_financial_years_updated_by_foreign` (`updated_by`),
  ADD KEY `company_financial_years_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_settings_company_id_foreign` (`company_id`),
  ADD KEY `company_settings_created_by_foreign` (`created_by`),
  ADD KEY `company_settings_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `company_users`
--
ALTER TABLE `company_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_users_company_id_foreign` (`company_id`),
  ADD KEY `company_users_user_id_foreign` (`user_id`),
  ADD KEY `company_users_created_by_foreign` (`created_by`),
  ADD KEY `company_users_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `contribution_ratio`
--
ALTER TABLE `contribution_ratio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contribution_ratio_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `contribution_ratio_created_by_foreign` (`created_by`),
  ADD KEY `contribution_ratio_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `contribution_slabs`
--
ALTER TABLE `contribution_slabs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contribution_slabs_user_contribution_id_foreign` (`user_contribution_id`);

--
-- Indexes for table `contributors`
--
ALTER TABLE `contributors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contributors_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country_taxes`
--
ALTER TABLE `country_taxes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_taxes_country_id_foreign` (`country_id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document_types_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `email_configrations`
--
ALTER TABLE `email_configrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_configrations_company_id_foreign` (`company_id`),
  ADD KEY `email_configrations_created_by_foreign` (`created_by`),
  ADD KEY `email_configrations_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_company_id_foreign` (`company_id`),
  ADD KEY `expenses_category_id_foreign` (`category_id`),
  ADD KEY `expenses_created_by_foreign` (`created_by`),
  ADD KEY `expenses_updated_by_foreign` (`updated_by`),
  ADD KEY `expenses_subcategory_id_foreign` (`subcategory_id`),
  ADD KEY `expenses_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_categories_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `expense_categories_created_by_foreign` (`created_by`),
  ADD KEY `expense_categories_updated_by_foreign` (`updated_by`),
  ADD KEY `expense_categories_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `incomes`
--
ALTER TABLE `incomes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incomes_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `incomes_company_id_foreign` (`company_id`),
  ADD KEY `incomes_category_id_foreign` (`category_id`),
  ADD KEY `incomes_subcategory_id_foreign` (`subcategory_id`),
  ADD KEY `incomes_created_by_foreign` (`created_by`),
  ADD KEY `incomes_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `income_categories`
--
ALTER TABLE `income_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `income_categories_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `income_categories_parent_id_foreign` (`parent_id`),
  ADD KEY `income_categories_created_by_foreign` (`created_by`),
  ADD KEY `income_categories_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoices_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `invoices_client_id_foreign` (`client_id`),
  ADD KEY `invoices_invoice_currency_id_foreign` (`invoice_currency_id`),
  ADD KEY `invoices_company_currency_id_foreign` (`company_currency_id`),
  ADD KEY `invoices_company_id_foreign` (`company_id`),
  ADD KEY `invoices_created_by_foreign` (`created_by`),
  ADD KEY `invoices_term_id_foreign` (`term_id`),
  ADD KEY `invoices_updated_by_foreign` (`updated_by`),
  ADD KEY `invoices_company_financial_id_foreign` (`company_financial_id`),
  ADD KEY `invoices_subscriber_currency_id_foreign` (`subscriber_currency_id`);

--
-- Indexes for table `invoice_attachments`
--
ALTER TABLE `invoice_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_attachments_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_attachments_document_type_id_foreign` (`document_type_id`);

--
-- Indexes for table `invoice_banks`
--
ALTER TABLE `invoice_banks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_banks_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_banks_company_bank_id_foreign` (`company_bank_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_items_client_id_foreign` (`client_id`),
  ADD KEY `invoice_items_item_type_id_foreign` (`item_type_id`);

--
-- Indexes for table `invoice_item_types`
--
ALTER TABLE `invoice_item_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_item_types_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `invoice_item_types_created_by_foreign` (`created_by`),
  ADD KEY `invoice_item_types_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_payments_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_payments_created_by_foreign` (`created_by`),
  ADD KEY `invoice_payments_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_taxes_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_taxes_tax_id_foreign` (`tax_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_sources`
--
ALTER TABLE `payment_sources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_sources_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `payment_sources_created_by_foreign` (`created_by`),
  ADD KEY `payment_sources_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `payment_terms`
--
ALTER TABLE `payment_terms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_terms_company_id_foreign` (`company_id`),
  ADD KEY `payment_terms_created_by_foreign` (`created_by`),
  ADD KEY `payment_terms_updated_by_foreign` (`updated_by`),
  ADD KEY `payment_terms_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `url` (`url`);

--
-- Indexes for table `permission_group`
--
ALTER TABLE `permission_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permission_group_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `restrictions`
--
ALTER TABLE `restrictions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `restrictions_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_group_id_foreign` (`group_id`),
  ADD KEY `role_subscriber_id_foreign` (`subscriber_id`);

--
-- Indexes for table `source_platforms`
--
ALTER TABLE `source_platforms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `source_platforms_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `source_platforms_created_by_foreign` (`created_by`),
  ADD KEY `source_platforms_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscribers_country_id_foreign` (`country_id`),
  ADD KEY `currency_id` (`currency_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `users_role_id_foreign` (`role_id`),
  ADD KEY `users_created_by_foreign` (`created_by`),
  ADD KEY `users_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `user_contributions`
--
ALTER TABLE `user_contributions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_contributions_subscriber_id_foreign` (`subscriber_id`),
  ADD KEY `user_contributions_contributor_id_foreign` (`contributor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_token`
--
ALTER TABLE `app_token`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=610;

--
-- AUTO_INCREMENT for table `bank_fields`
--
ALTER TABLE `bank_fields`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `client_contributed_user`
--
ALTER TABLE `client_contributed_user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `client_groups`
--
ALTER TABLE `client_groups`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `company_banks`
--
ALTER TABLE `company_banks`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company_clients`
--
ALTER TABLE `company_clients`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `company_financial_years`
--
ALTER TABLE `company_financial_years`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_settings`
--
ALTER TABLE `company_settings`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `company_users`
--
ALTER TABLE `company_users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `contribution_ratio`
--
ALTER TABLE `contribution_ratio`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contribution_slabs`
--
ALTER TABLE `contribution_slabs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `contributors`
--
ALTER TABLE `contributors`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `country_taxes`
--
ALTER TABLE `country_taxes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `document_types`
--
ALTER TABLE `document_types`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_configrations`
--
ALTER TABLE `email_configrations`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `incomes`
--
ALTER TABLE `incomes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `income_categories`
--
ALTER TABLE `income_categories`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `invoice_attachments`
--
ALTER TABLE `invoice_attachments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice_banks`
--
ALTER TABLE `invoice_banks`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- AUTO_INCREMENT for table `invoice_item_types`
--
ALTER TABLE `invoice_item_types`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=171;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `payment_sources`
--
ALTER TABLE `payment_sources`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payment_terms`
--
ALTER TABLE `payment_terms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `permission_group`
--
ALTER TABLE `permission_group`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `restrictions`
--
ALTER TABLE `restrictions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `source_platforms`
--
ALTER TABLE `source_platforms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_contributions`
--
ALTER TABLE `user_contributions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_token`
--
ALTER TABLE `app_token`
  ADD CONSTRAINT `app_token_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bank_fields`
--
ALTER TABLE `bank_fields`
  ADD CONSTRAINT `bank_fields_company_bank_id_foreign` FOREIGN KEY (`company_bank_id`) REFERENCES `company_banks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_client_group_id_foreign` FOREIGN KEY (`client_group_id`) REFERENCES `client_groups` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `clients_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clients_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `clients_source_by_foreign` FOREIGN KEY (`source_by`) REFERENCES `contributors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `clients_source_from_foreign` FOREIGN KEY (`source_from`) REFERENCES `source_platforms` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `clients_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clients_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `client_contributed_user`
--
ALTER TABLE `client_contributed_user`
  ADD CONSTRAINT `client_contributed_user_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `client_contributed_user_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `client_contributed_user_user_id_foreign` FOREIGN KEY (`contributor_id`) REFERENCES `contributors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_groups`
--
ALTER TABLE `client_groups`
  ADD CONSTRAINT `client_groups_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `client_groups_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `client_groups_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `companies_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `companies_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `companies_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `companies_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_banks`
--
ALTER TABLE `company_banks`
  ADD CONSTRAINT `company_banks_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_banks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_banks_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_banks_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_clients`
--
ALTER TABLE `company_clients`
  ADD CONSTRAINT `company_clients_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_clients_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_clients_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_clients_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_financial_years`
--
ALTER TABLE `company_financial_years`
  ADD CONSTRAINT `company_financial_years_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_financial_years_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_financial_years_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_financial_years_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_settings`
--
ALTER TABLE `company_settings`
  ADD CONSTRAINT `company_settings_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_settings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_users`
--
ALTER TABLE `company_users`
  ADD CONSTRAINT `company_users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contribution_ratio`
--
ALTER TABLE `contribution_ratio`
  ADD CONSTRAINT `contribution_ratio_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contribution_ratio_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `contribution_ratio_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contribution_slabs`
--
ALTER TABLE `contribution_slabs`
  ADD CONSTRAINT `contribution_slabs_user_contribution_id_foreign` FOREIGN KEY (`user_contribution_id`) REFERENCES `user_contributions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contributors`
--
ALTER TABLE `contributors`
  ADD CONSTRAINT `contributors_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `country_taxes`
--
ALTER TABLE `country_taxes`
  ADD CONSTRAINT `country_taxes_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `document_types`
--
ALTER TABLE `document_types`
  ADD CONSTRAINT `document_types_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_configrations`
--
ALTER TABLE `email_configrations`
  ADD CONSTRAINT `email_configrations_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `email_configrations_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `email_configrations_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `expense_categories` (`id`),
  ADD CONSTRAINT `expenses_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expenses_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD CONSTRAINT `expense_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expense_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `expense_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expense_categories_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `expense_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `incomes`
--
ALTER TABLE `incomes`
  ADD CONSTRAINT `incomes_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `income_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `incomes_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `incomes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `incomes_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `income_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `incomes_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `incomes_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `income_categories`
--
ALTER TABLE `income_categories`
  ADD CONSTRAINT `income_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `income_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `income_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `income_categories_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `income_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_company_currency_id_foreign` FOREIGN KEY (`company_currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_company_financial_id_foreign` FOREIGN KEY (`company_financial_id`) REFERENCES `company_financial_years` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_invoice_currency_id_foreign` FOREIGN KEY (`invoice_currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_subscriber_currency_id_foreign` FOREIGN KEY (`subscriber_currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `payment_terms` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_attachments`
--
ALTER TABLE `invoice_attachments`
  ADD CONSTRAINT `invoice_attachments_document_type_id_foreign` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoice_attachments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_banks`
--
ALTER TABLE `invoice_banks`
  ADD CONSTRAINT `invoice_banks_company_bank_id_foreign` FOREIGN KEY (`company_bank_id`) REFERENCES `company_banks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_banks_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_item_type_id_foreign` FOREIGN KEY (`item_type_id`) REFERENCES `invoice_item_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_item_types`
--
ALTER TABLE `invoice_item_types`
  ADD CONSTRAINT `invoice_item_types_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_item_types_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_item_types_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_payments`
--
ALTER TABLE `invoice_payments`
  ADD CONSTRAINT `invoice_payments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_payments_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  ADD CONSTRAINT `invoice_taxes_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_taxes_tax_id_foreign` FOREIGN KEY (`tax_id`) REFERENCES `country_taxes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_sources`
--
ALTER TABLE `payment_sources`
  ADD CONSTRAINT `payment_sources_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_sources_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_sources_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment_terms`
--
ALTER TABLE `payment_terms`
  ADD CONSTRAINT `payment_terms_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_terms_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_terms_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payment_terms_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permission_group`
--
ALTER TABLE `permission_group`
  ADD CONSTRAINT `permission_group_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `restrictions`
--
ALTER TABLE `restrictions`
  ADD CONSTRAINT `restrictions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `role_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `permission_group` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `source_platforms`
--
ALTER TABLE `source_platforms`
  ADD CONSTRAINT `source_platforms_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `source_platforms_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `source_platforms_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD CONSTRAINT `subscribers_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subscribers_currency_id_foreign` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_contributions`
--
ALTER TABLE `user_contributions`
  ADD CONSTRAINT `user_contributions_contributor_id_foreign` FOREIGN KEY (`contributor_id`) REFERENCES `contributors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_contributions_subscriber_id_foreign` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
