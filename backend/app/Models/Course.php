<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'duration_hours',
        'price',
        'max_students',
        'status'
    ];

    protected $casts = [
        'duration_hours' => 'integer',
        'price' => 'decimal:2',
        'max_students' => 'integer',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments')
                    ->withPivot('start_date', 'price_paid', 'status')
                    ->withTimestamps();
    }

    public function activeEnrollments()
    {
        return $this->enrollments()->where('status', 'active');
    }
}
