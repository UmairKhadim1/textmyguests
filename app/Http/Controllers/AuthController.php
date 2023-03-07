<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateNameEmailRequest;
use App\Http\Requests\UpdatePasswordRequest;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Auth\Events\PasswordReset;
use Twilio\Rest\Client;
use App\User;
use Hash;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use \App\Events\UserSavedEvent;
use App\UserTokens;
use App\Businesses;
use Exception;

class AuthController extends Controller
{
    use SendsPasswordResetEmails, ResetsPasswords {
        ResetsPasswords::broker insteadof SendsPasswordResetEmails;
        ResetsPasswords::credentials insteadof SendsPasswordResetEmails;
    }

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'login',
            'register',
            'logout',
            'sendOTP',
            'verify',
            'forgotPassword',
            'resetForgottenPassword'
        ]]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if ($token = auth()->attempt($credentials)) {
            return $this->respondWithToken($token);
        }

        throw new AuthenticationException('Bad Credentials', [auth()->guard()]);
    }

    /**
     * Get a JWT to impersonate a user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function impersonate(Request $request)
    {
        if (auth()->user()->can('impersonate')) {
            $user = User::find($request->userId);

            if ($token = auth()->user()->impersonate($user)) {
                return $this->respondWithToken($token);
            }
        }

        return response()->json([
            'status' => 'fail',
        ], 401);
    }

    public function leaveImpersonation(Request $request)
    {
        if ($token = Auth::user()->leaveImpersonation()) {
            return $this->respondWithToken($token);
        }

        return response()->json([
            'status' => 'fail',
        ], 401);
    }
    public function sendOTP(Request $request)
    {
        // dd('abcdefgh');
        $phoneNum = $request->phone;
        $token = getenv("TWILIO_LIVE_TOKEN");
        $twilio_sid = getenv("TWILIO_LIVE_SID");
        $twilio_verify_sid = getenv("TWILIO_VERIFY_SID");
        $twilio = new Client($twilio_sid, $token);
        $twilio->verify->v2->services($twilio_verify_sid)
            ->verifications
            ->create($phoneNum, "sms");
        return response()->json([
            'status' => 'success'
        ]);
    }
    public function register(RegisterRequest $request)
    {

        $data = $request->validated();
        /* Get credentials from .env */

        $user = new User();
        $user->first_name = $data['firstName'];
        $user->last_name = $data['lastName'];
        $user->mobilePhone = $data['phone'];
        $user->email = strtolower($data['email']);
        $user->password = bcrypt($data['password']);
        $user->usersource = $data['userSource'];
        $user->isProfessional = $request->isProfessional;
        if ($request->isProfessional) {
            $user->partner_discount = 40;
        }
        $user->save();
        if ($user && $user->isProfessional) {

            // dd($user->id);
            Businesses::create([
                'user_id' => $user->id,
                'type' =>  $request->typeOfBusiness,
                'name' =>  $request->businessname,
                'website' =>  $request->website
            ]);
        }
        // event(new UserSavedEvent($user));
        $token = auth()->login($user);
        return $this->respondWithToken($token);
    }
    public function verify(Request $request)
    {

        $data = $request->validate([
            'otp' => ['required', 'numeric'],
            'phone' => ['required', 'string'],
        ]);
        /* Get credentials from .env */
        try {
            $token = getenv("TWILIO_LIVE_TOKEN");
            $twilio_sid = getenv("TWILIO_LIVE_SID");
            $twilio_verify_sid = getenv("TWILIO_VERIFY_SID");
            $twilio = new Client($twilio_sid, $token);
            $verification = $twilio->verify->v2->services($twilio_verify_sid)
                ->verificationChecks
                ->create($data['otp'], array('to' => $data['phone']));
            if ($verification->valid) {
                // dd($verification);
                /* Authenticate user */

                return response()->json([
                    'message' => 'Phone number is verified',
                    'status_code' => 200
                ]);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'status_code' => 404
                ]);
            }
        } catch (Exception $ex) {
            return response()->json([
                'message' => 'Server error',
                'data' => $ex->getMessage(),
                'status_code' => 500
            ]);
            // abort(500, 'Server error');
        }
        //return back()->with(['phone' => $data['phone'], 'error' => 'Invalid verification code entered!']);
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $manager = app('impersonate');

        $user = auth()->user();
        $user->impersonated = $manager->isImpersonating();

        return response()->json($user);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $user = auth()->user();
        if ($user) {
            UserTokens::where('user_id', $user->id)->delete();

            auth()->logout();

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ]);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    public function updateBasicInfo(UpdateNameEmailRequest $request)
    {
        $body = $request->validated();
        $user = auth()->user();
        $user->first_name = $body['firstName'];
        $user->last_name = $body['lastName'];
        $user->email = $body['email'];
        $user->save();
        return response()->json([
            'status' => 'success',
            'data' => [
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
            ],
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $body = $request->validated();
        $user = auth()->user();
        if (Hash::check($body['old_password'], $user->password)) {
            $user->password = Hash::make($body['new_password']);
            $user->save();
            return response()->json([
                'status' => 'success',
            ]);
        }
        return response()->json([
            'status' => 'fail',
        ], 401);
    }

    /**
     * Get the token array structure.
     *
     * @param  string  $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60
            ],
        ]);
    }

    /**
     * Handle forgotten password reset sender
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse 
     */
    public function forgotPassword(Request $request)
    {
        return $this->sendResetLinkEmail($request);
    }

    /**
     * Get the response for a successful password reset link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    protected function sendResetLinkResponse(Request $request, $response)
    {
        return response()->json(['status' => 'success']);
    }

    /**
     * Get the response for a failed password reset link.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendResetLinkFailedResponse(Request $request, $response)
    {
        return response()->json(['status' => 'fail'], 500);
    }

    /**
     * Handles forgotten password reset
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetForgottenPassword(Request $request)
    {
        $request->merge(['email' => decrypt($request->encryptedEmail)]);

        return $this->reset($request);
    }

    protected function resetPassword($user, $password)
    {
        $user->password = Hash::make($password);
        $user->save();

        event(new PasswordReset($user));
    }

    /**
     * Get the response for a successful password reset.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    protected function sendResetResponse(Request $request, $response)
    {
        return response()->json(['status' => 'success']);
    }

    /**
     * Get the response for a failed password reset.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $response
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendResetFailedResponse(Request $request, $response)
    {
        return response()->json(['status' => 'fail'], 401);
    }
}
