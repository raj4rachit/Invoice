<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invoice</title>
  <style>
    /*****************css*****************/

    /* @import url(https://fonts.googleapis.com/css?family=Roboto:100,300,400,900,700,500,300,100); */
    /* @import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap); */

    @font-face {
      font-family: 'Poppins';
      font-weight: normal;
      font-style: normal;
      font-variant: normal;
      src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
    }

    html {
      margin: 0;
    }

    body {
      margin: 0px;
      background: #FFF;
      font-family: 'Poppins', sans-serif;
    }

    h2 {
      font-size: 26px;
      padding-bottom: 15px;
    }

    .main-container {
      display: block;
      width: 100%;
      margin: 0px auto;
      background: #fff;
      padding: 0px;
    }

    /*****************css*****************/
    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      padding: 5px;
      border-bottom: 0px solid #cccaca;
      font-size: 0.70em;
      text-align: left;
    }

    th {
      font-size: 0.7em;
      text-align: left;
      padding: 5px 10px;
    }

    * {
      box-sizing: border-box;
    }

    .row {
      display: flex;
    }

    .column {
      float: left;
      width: 49.6%;
      padding: 1px;
      font-family: 'Poppins', sans-serif;
      margin-bottom: 10px;
      font-size: 13px;
    }

    /* Clearfix (clear floats) */
    .row::after {
      content: "";
      clear: both;
      display: table;
    }

    @media screen and (max-width: 767px) {
      .main-container {
        display: block;
        width: 100%;
        margin: 0px auto;
        background: #fff;
        padding: 0px;
      }
    }
  </style>
</head>

<body>
  <div class="main-container">
    <table>
      <tr>
        <td style="display: inline-block;margin: 0px;padding: 0px; float:left; width:60%;border: none;">
          <img style="max-width: 250px;margin-top: 0px;" src="<?= $invoiceCompanyDetails->company_logo  ?>" alt="Logo" />
        </td>
        <td style="border: none; padding-bottom: 20px;border: none; padding-bottom: 20px;float:right;width: 30%;">
          <table>
            <tr>
              <td colspan="1" style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;"><strong style="font-size:20px;">Invoice</strong></td>
            </tr>
            <tr>
              <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;">Invoice # <?php echo  $invoice->invoice_no ?></td>
              <!-- <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;"></td> -->
            </tr>
            <tr>
              <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;">Invoice Date - <?php echo $invoice->invoice_date ?></td>
              <!-- <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;"></td> -->
            </tr>
            <tr>
              <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;">Invoice Due Date - <?php echo $invoice->invoice_due_date  ?></td>
              <!-- <td style="padding: 3px 0px;border-bottom: none;font-size: 13px;text-align: left;"></td> -->
            </tr>

          </table>
        </td>
      </tr>
    </table>

    <table>
      <tr style="background: #515151;font-size: 11px;border: 1px solid #515151;color: #fff;">
        <td style="color: #FFF;font-size: 14px;display: inline-block;width: 50%;border: none;">Our Information</td>
        <td style="color: #FFF;font-size: 14px;border: none;padding: 0px 10px;">Invoice To</td>
      </tr>
      <tr style="border: 1px solid #cccaca;">
        <td style="font-size: 13px; line-height:18px; width:50%; border-bottom:1px solid #cccaca;">
          <b style="line-height:26px;"><?= $invoiceCompanyDetails->company_name ?></b><br>
          <?= $invoiceCompanyDetails->address_1 ?>, <br>
          <?php if ($invoiceCompanyDetails->address_2 != null) : ?>
            <?= $invoiceCompanyDetails->address_2 ?>, <br>
          <?php endif; ?>
          <?= $invoiceCompanyDetails->city . ", " . $invoiceCompanyDetails->state ?> <br>
          <?= $invoiceCompanyDetails->country_name . ", " . $invoiceCompanyDetails->zip_code ?><br>
          Phone : <?= $invoiceCompanyDetails->contact_number ?><br>
          Email : <?= $invoiceCompanyDetails->email ?><br>
          Tax ID : <?= $invoiceCompanyDetails->tax_no ?><br>
          GST No. : <?= $invoiceCompanyDetails->gst_vat_no ?>

        </td>
        <td style="font-size: 13px; line-height:18px;border-bottom:1px solid #cccaca;">
          <b style="line-height:26px;"><?= $client->company_name ?></b><br>
          <?= $client->address_1 ?>, <br>
          <?php if ($client->address_2 != null) : ?>
            <?= $client->address_2 ?>, <br>
          <?php endif; ?>
          <?= $client->city . ", " . $client->state ?> <br>
          <?= $client->country_name . ", " . $client->zip_code ?><br>
          Phone : <?= $client->phone ?><br>
          Email : <?= $client->email ?><br>
          Tax ID : <?= $client->tax_no ?><br>
          GST No. : <?= $client->gst_vat_no ?>
        </td>
      </tr>
    </table>
    <br>
    <table style="border: 1px solid #cccaca;margin:0px auto 25px auto;">
      <tr>
        <td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;">Description</td>
        <td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff; width: 10%;"><?= "Price" ?></td>
        <td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff; width: 10%;"><?= "Resource Qty" ?></td>
        <?= $invoice->total_deduction_flag ? '<td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;width: 11%;">Deduction</td>' : ''; ?>
        <td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;width: 10%;">Amount</td>
        <?= $invoice->total_discount_flag ? '<td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;width: 10%;"> Discount </td>' : ''; ?>

        <?php
        if (!empty($invoiceTaxes)) {
          foreach ($invoiceTaxes as $tax) :
            echo '<td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff; width:10%">' . $tax['tax_name'] . ' (' . $tax['tax_rate'] . '%)</td>';
          endforeach;
        }
        ?>
        <td align="center" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff; width: 14%;">Total</td>
      </tr>
      <?php foreach ($invoiceItems as $invoiceItem) : ?>
        <tr>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: left;border-left: 1px solid #cccaca;"><?= $invoiceItem['resource_name'] . "<br>" . $invoiceItem['description'] ?></td>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoiceItem['rate']  ?></td>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoiceItem['resource_quantity'] ?></td>
          <?= $invoice->total_deduction_flag ? '<td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;">' . $invoiceItem['deduction'] . '</td>' : ''; ?>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoiceItem['subtotal'] ?></td>
          <?= $invoice->total_discount_flag ? '<td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;">' . $invoiceItem['discount_amount'] . '</td>' : ''; ?>
          <?php
          foreach ($invoiceItem['itemTaxAmount'] as $tax) {
            echo '<td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;">' . $tax['tax_amount'] . '</td>';
          }
          ?>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><strong><?= $invoiceItem['total_amount'] ?></strong></td>
        </tr>
      <?php endforeach; ?>

      <tr>
        <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: left;border-left: 1px solid #cccaca;" colspan='3'><strong>Grand Total</strong></td>
        <?php if ($invoice->total_deduction_flag) : ?>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoice->total_deduction; ?></td>
        <?php endif; ?>
        <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoice->subtotal; ?></td>
        <?php if ($invoice->total_discount_flag) : ?>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $invoice->total_discount; ?></td>
        <?php endif ?>
        <?php
        foreach ($invoiceTaxes as $tax) :
        ?>
          <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><?= $tax['tax_amount']; ?></td>
        <?php endforeach; ?>
        <td style="padding: 9px 4px;border-bottom: 1px solid #cccaca;font-size: 11px;text-align: right;border-left: 1px solid #cccaca;"><strong><?= $invoice->invoice_currency_total_amount; ?></strong></td>
      </tr>
    </table>

    <?php if (sizeof($banks) > 0) : ?>
      <h5>Bank Details:</h5>
      <!-- if bank is single -->
      <?php if (sizeof($banks) == 1) : ?>
        <?php foreach ($banks as $bank) : ?>
          <table style="width: 100%; padding:0px; margin:0px;">
            <tr>
              <td style="border: 1px solid #cccaca; padding:0px; float:left;">
                <table style="width: 100%; padding:0px; margin:0px;">
                  <tr>
                    <td colspan="2" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;"><?= $bank['bank_detail_name'] ?></td>
                  </tr>
                  <tr>
                    <td align="right" style="width: 50%; border-right: 1px solid #cccaca; padding-right:15px;">Bank Name</td>
                    <td style="padding-left:15px;"><?= $bank['bank_name'] ?></td>
                  </tr>
                  <tr>
                    <td align="right" style="width: 50%; border-right: 1px solid #cccaca; padding-right:15px;">Account Name</td>
                    <td style="padding-left:15px;"><?= $bank['account_name'] ?></td>
                  </tr>
                  <tr>
                    <td align="right" style="width: 50%; border-right: 1px solid #cccaca; padding-right:15px;">Account Number</td>
                    <td style="padding-left:15px;"><?= $bank['account_number'] ?></td>
                  </tr>

                  <?php foreach ($bank['filed'] as $filed) : ?>
                    <tr>
                      <td align="right" style="width: 50%; border-right: 1px solid #cccaca; padding-right:15px;"><?= $filed['key'] ?></td>
                      <td style="padding-left:15px;"><?= $filed['value'] ?></td>
                    </tr>
                  <?php endforeach; ?>
                </table>
              </td>
            </tr>
          </table>

        <?php endforeach; ?>

      <?php endif; ?>

      <!--  if Bank if multiple -->
      <?php if (sizeof($banks) > 1) : ?>
        <div class="row">
          <?php foreach ($banks as $bank) : ?>
            <div class="column">
              <table>
                <tr>
                  <td align="left" style="border: 1px solid #cccaca; width:100%; padding:0px;">
                    <table style="width: 100%; padding:0px; margin:0px; font-size: 15px;">
                      <tr>
                        <td colspan="2" style="background: #515151;font-size: 13px;border: 1px solid #515151;color: #fff;"><?= $bank['bank_detail_name'] ?></td>
                      </tr>
                      <tr>
                        <td style="width:50%;">Bank Name</td>
                        <td><?= $bank['bank_name'] ?></td>
                      </tr>
                      <tr>
                        <td style="width:50%;">Account Name</td>
                        <td><?= $bank['account_name'] ?></td>
                      </tr>
                      <tr>
                        <td style="width:50%;">Account Number</td>
                        <td><?= $bank['account_number'] ?></td>
                      </tr>
                      <?php foreach ($bank['filed'] as $filed) : ?>
                        <tr>
                          <td style="width:50%;"><?= $filed['key'] ?></td>
                          <td><?= $filed['value'] ?></td>
                        </tr>
                      <?php endforeach; ?>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    <?php endif; ?>

    <?php if ($invoice->invoice_note != '') : ?>
      <br>
      <div style="font-size: 11px;text-align: left;"><?= $invoice->invoice_note ?></div>
    <?php endif; ?>
    <!-- <h6><b>This is computer generated invoice no signature required.</b></h6> -->
    <?php if ($invoiceTerm) : ?>
      <br>
      <!-- <p><b>Invoice Terms<b></p> -->
      <div style="font-size: 13px;text-align: left;">
        <?= $invoiceTerm['description'] ?>
      </div>
    <?php endif; ?>
  </div>
</body>

</html>