<?php

namespace App\Http\Controllers;

use App\Announcement;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
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
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'limit'         => 'digits_between:0,3',
            'start_date'    => 'required_with:end_date|date|before_or_equal:end_date',
            'end_date'      => 'required_with:start_date|date|after_or_equal:start_date',
        ]);

        if ($validator->fails())
        {
            return $this->respondWithValidatorErrors($validator->errors());
        }

        $perPage = 15;

        if ($request->has('limit'))
        {
            $perPage = $request->get('limit');
        }

        $announcements = Announcement::orderBy('created_at', 'DESC');

        if ($request->has('start_date'))
        {
            $start = new Carbon($request->get('start_date'));
            $end = new Carbon($request->get('end_date'));
            $announcements->datesBetween($start, $end);
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $announcements->paginate($perPage);

        return $this->respondWithPagination($request, $paginator, ['Announcements' => $paginator->items()]);
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
