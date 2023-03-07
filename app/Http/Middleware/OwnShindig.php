<?php

namespace App\Http\Middleware;

use Closure;
use Gate;
use App\Shindig;

class OwnShindig
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $id = $request->route('event');
        $shindig = Shindig::find($id);
        if (Gate::allows('modify-shindig', $shindig)) {
            return $next($request);
        } else {
            return response()->json([
                'status' => 'fail',
                'data' => [
                    'auth' => 'You are not authorized to view or modify those data',
                ],
            ]);
        }
    }
}
