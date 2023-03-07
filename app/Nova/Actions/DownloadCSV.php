<?php

namespace App\Nova\Actions;


use Maatwebsite\LaravelNovaExcel\Actions\DownloadExcel;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use App\Shindig;

class DownloadCSV extends DownloadExcel implements WithMapping
{
    public $name = "Download CSV";

    /**
     * @param Shindig $shindig
     *
     * @return array
     */
    public function map($shindig): array
    {
        return [
            $shindig->id,
            $shindig->name,
            $shindig->event_date->toDateString(),
            $this->getEventOwners($shindig),
            $shindig->paidGuestLimit(),
            $shindig->guestCount(),
            $shindig->messageCount(),
        ];
    }

    public function getEventOwners(Shindig $shindig)
    {
        $owners = '';

        foreach ($shindig->owners as $key => $owner) {
            $owners .= $owner->email;
            if ($key !== count($shindig->owners) - 1) {
                $owners .= ', ';
            }
        }

        return $owners;
    }
 
}
