<?php

namespace App\Http\Controllers;

use App\Event;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Validator;

class EventsController extends Controller
{
    /** @var  User */
    protected $user;

    /**
     * EventsController constructor.
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

        $perPage = ($request->has('limit')) ?
            $request->get('limit') : 10;

        if ($request->has('limit'))
        {
            $perPage = $request->get('limit');
        }

        $events = Event::orderBy('start', 'DESC');

        if ($request->has('start_date'))
        {
            $start = new Carbon($request->get('start_date'));
            $end = new Carbon($request->get('end_date'));
            $events->datesBetween($start, $end);
        }

        /** @var LengthAwarePaginator $paginator */
        $paginator = $events->paginate($perPage);

        return $this->respondWithPagination($request, $paginator, ['Events' => $paginator->items()]);
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
            'game'      => 'required|max:255',
            'content'   => 'required|max:65536',
            'start'     => 'required|date|before_or_equal:end',
            'end'       => 'required|date|after_or_equal:start',
        ]);

        if ($validator->fails()) {
            return $this->respondWithValidatorErrors($validator->errors());
        }

        Event::createByUser($this->user, $request->all());
        return $this->respond(['message' => 'Success']);
    }

    /**
     * Display the specified resource.
     *
     * @param  Event $event
     * @return \Illuminate\Http\Response
     */
    public function show(Event $event)
    {
        return $this->respond(['Event' => $event]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Event  $event
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Event $event)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'max:255',
            'game'      => 'max:255',
            'content'   => 'max:65536',
            'start'     => 'required_with:end|date|before_or_equal:end',
            'end'       => 'required_with:start|date|after_or_equal:start',
        ]);

        if ($validator->fails()) {
            return $this->respondWithValidatorErrors($validator->errors());
        }

        $event->updateByUser($this->user)->fill($request->all())->save();

        return $this->respond(['message' => 'Success']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Event  $event
     * @return \Illuminate\Http\Response
     */
    public function destroy(Event $event)
    {
        $event->updateByUser($this->user)->delete();
        return $this->respond(['message' => 'Success']);
    }
}
