<?php

namespace App\Entities;

class Collection
{
    public static function tableData(array $data, int $recordsTotal)
    {
        return [
            'totalCount' => $recordsTotal,
            'data' => $data,
        ];
    }
}
