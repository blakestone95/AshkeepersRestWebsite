<?php

namespace App\Http\Controllers;

use App\Event;
use Illuminate\Http\Request;

class EventsController extends Controller
{
    public function index()
    {
        return ['Events' => Event::all()];
    }
}
