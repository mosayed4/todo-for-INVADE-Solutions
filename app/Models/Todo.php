<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    
    protected $table = 'todos';
    protected $primaryKey = 'id';
    protected $fillable = ['title', 'description', 'status','categorie_ID','user_ID'];
    use SoftDeletes;
    use HasFactory;
}
