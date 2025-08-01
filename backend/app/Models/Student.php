<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'birth_date',
        'document_number',
        'address',
        'city',
        'state',
        'zip_code'
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
                    ->withPivot('start_date', 'price_paid', 'status')
                    ->withTimestamps();
    }
}
