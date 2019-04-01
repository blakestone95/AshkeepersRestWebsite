<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementsController extends Controller
{
    /** @var  User */
    protected $user;

    /**
     * AnnouncementsController constructor.
     */
    public function __construct()
    {
        $this->user = auth()->user();
        // TODO: Remove this when implementing authentication
        if (!$this->user)
        {
            $this->user = User::first();
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $announcements = Announcement::GetCreatedInLastMonth()->get();
        return $this->respond(['Announcements' => $announcements]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required|max:255',
            'content'   => 'required|max:65536'
        ]);

        if ($validator->fails()) {
            return $this->respondWithValidatorErrors($validator->errors());
        }

        Announcement::createByUser($this->user, $request->all());
        return $this->respond(['message' => 'Success']);
    }

    /**
     * Display the specified resource.
     *
     * @param  Announcement $announcement
     * @return \Illuminate\Http\Response
     */
    public function show(Announcement $announcement)
    {
        return $this->respond(['Announcement' => $announcement]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Announcement  $announcement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'max:255',
            'content'   => 'max:65536'
        ]);

        if ($validator->fails()) {
            return $this->respondWithValidatorErrors($validator->errors());
        }

        $announcement->updateByUser($this->user)->fill($request->all())->save();

        return $this->respond(['message' => 'Success']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Announcement  $announcement
     * @return \Illuminate\Http\Response
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->updateByUser($this->user)->delete();
        return $this->respond(['message' => 'Success']);
    }
}
