<?php

namespace App\Validation;

use Config\Database;

class CustomValidation
{
    public function is_uniques(string $str, string $field, array $data): bool
    {
        // [$field, $ignoreField, $checkField] = array_pad(explode(',', $field), 3, null);


        $fields = explode(',', $field);

        sscanf($fields[0], '%[^.].%[^.]', $table, $field);
        unset($fields['0']);

        $row = Database::connect($data['DBGroup'] ?? null)
            ->table($table)
            ->select('1')
            ->where($field, $str)
            ->limit(1);


        if (!empty($fields[1])) {
            $firstBrecket =  str_replace("[", "", $fields[1]);
            $secondBrecket =  str_replace("]", "", $firstBrecket);
            $fields1 = explode(',',  $secondBrecket);
            
            foreach ($fields1 as $val) {
                sscanf($val, '%[^.].%[^.]', $name, $value);
                if (!empty($name)) {
                    $row = $row->where("{$name}", $value);
                }
                // $row = $row->where("{$name}", $value);
            }
        }

        if (!empty($fields[2])) {
            $firstBrecket =  str_replace("[", "", $fields[2]);
            $secondBrecket =  str_replace("]", "", $firstBrecket);
            $fields2 = explode(',',  $secondBrecket);
            
            foreach ($fields2 as $val) {
                sscanf($val, '%[^.].%[^.]', $name, $value);
                if (!empty($name)) {
                    $row = $row->where("{$name} !=", $value);
                }
                // $row = $row->where("{$name}", $value);
            }
        }

        $query = $row->get()->getRow() === null;

        return $query ?? false;
    }
}
