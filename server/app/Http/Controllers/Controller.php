<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response as IlluminateResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;



class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Status Code.
     *
     * @var int
     */
    protected $statusCode = IlluminateResponse::HTTP_OK;


    /**
     * Response with an internal error.
     *
     * @param string $message
     *
     * @return mixed
     */
    public function respondInternalError($message = 'Internal Error!')
    {
        return $this->setStatusCode(IlluminateResponse::HTTP_INTERNAL_SERVER_ERROR)->respondWithError($message);
    }

    /**
     * Response with a not found error.
     *
     * @param string $message
     *
     * @return mixed
     */
    public function responseNotFound($message = 'Not Found!')
    {
        return $this->setStatusCode(IlluminateResponse::HTTP_NOT_FOUND)->respondWithError($message);
    }

    /**
     * Respond with an error.
     *
     * @param $message
     *
     * @return mixed
     */
    public function respondWithError($message)
    {
        return $this->respond([
            'error' => [
                'message' => $message,
                'status_code' => $this->getStatusCode()
            ]
        ]);
    }

    public function respondWithValidatorErrors($errors)
    {
        return $this->setStatusCode(IlluminateResponse::HTTP_UNPROCESSABLE_ENTITY)
            ->respondWithError($errors);
    }

    public function respondWithPagination(Request $request, LengthAwarePaginator $model, $data, $headers = [])
    {
        $model->appends('query', $request->get('query'));
        $model->appends('limit', $request->get('limit'));

        $data = array_merge($data, [
            'paginator' => [
                'total_count' => $model->total(),
                'total_pages' => ceil($model->total() / $model->perPage()),
                'current_page' => $model->currentPage(),
                'limit' => $model->perPage(),
                'previous_page_url' => $model->previousPageUrl(),
                'next_page_url' => $model->nextPageUrl()
            ]
        ]);

        return $this->respond($data, $headers);
    }

    /**
     * Response json.
     *
     * @param $data
     * @param array $headers
     *
     * @return mixed
     */
    public function respond($data, $headers = [])
    {
        $data = array_merge_recursive($data, [
            'meta' => [
                'signed_in' => auth()->check()
            ]
        ]);

        return response()->json($data, $this->getStatusCode(), $headers);
    }

    /**
     * Get status code.
     *
     * @return int
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * Set status code.
     *
     * @param int $statusCode
     *
     * @return $this
     */
    public function setStatusCode($statusCode)
    {
        $this->statusCode = $statusCode;

        return $this;
    }

}
