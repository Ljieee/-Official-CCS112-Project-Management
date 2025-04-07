<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    // Allow mass assignment for these fields
    protected $fillable = ['title', 'description', 'status'];


    public function tasks()
    {
    return $this->hasMany(Task::class);
    }

}
