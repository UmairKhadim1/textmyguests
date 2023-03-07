<?php

namespace App\Exports;

use App\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CsvExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::all('id', 'first_name', 'last_name', 'email', 'mobilePhone', 'userSource');
    }
    public function headings(): array
    {
        return ["Id", "First Name", "last Name", "Email", "Phone Number", "Source"];
    }
}
