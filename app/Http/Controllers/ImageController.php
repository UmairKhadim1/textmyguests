<?php

namespace App\Http\Controllers;

use App\InboundSMS;
use App\Mail\SendImages;
use App\Message;
use App\Shindig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\Filesystem;
use League\Flysystem\ZipArchive\ZipArchiveAdapter;
use Illuminate\Support\Str;
use Aws\S3\S3Client;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth.api');
    }
    public function downloadImages($id)
    {
        $shindig = Shindig::findBySlug($id);
        // $replies = InboundSMS::where('messagingServiceSid', $shindig->messagingServiceSid)->where('shindig_id', $shindig->id)->get();
        $replies_recieved = $shindig->InboundSMS()->get();
        // dd($replies_recieved);

        $media = $replies_recieved->map(function ($reply) {
            return $reply->media()->get();
        });

        $images = [];
        $i = 0;
        //get all media that contains s3_filename
        foreach ($media as $md) {
            foreach ($md as $m) {
                // $url = $m->getS3URL();
                if (isset($m->s3_filename)) {
                    $images[$i] = $m->s3_filename;
                    $i++;
                }
            }
        }
        $msg_images = [];
        $j = 0;

        //get all the messages that contains media
        if ($shindig->messages()->get()) {
            $messages = $shindig->messages()->get();
            foreach ($messages as $md) {
                if (isset($md->media_url)) {
                    $msg_images[$j] = $md->media_url;
                    $j++;
                }
            }
        }
        //no media and mo messages then 
        if (count($images) < 1 && count($msg_images) < 1) {
            return response()->json([
                'message' => 'You do not have any image to download'
            ], 404);
        }

        $time = time();

        //create a zip file at server
        $zip = new Filesystem(new ZipArchiveAdapter(public_path('events/zipFiles/' . $shindig->id . '_' . $time . '.zip')));
        foreach ($images as $image) {
            $metaData = Storage::disk('s3')->getMetaData($image); //get meta data of image from server
            $extension = explode('/', $metaData['mimetype']);
            // dd($extension[1]);
            $fileContent = Storage::disk('s3')->get($image); //download image from server
            $zip->put(Str::random(4) . '.' . $extension[1], $fileContent); //put downloaded image to zip file
        }

        foreach ($msg_images as $image) {
            $extension = pathinfo($image, PATHINFO_EXTENSION); //get the meta data of image from server
            $fileContent = file_get_contents($image); //download the file
            $zip->put(Str::random(4) . '.' . $extension, $fileContent); //put that downloaded file into the zip
        }

        $zip->getAdapter()->getArchive()->close(); //close that zip file
        $path = public_path('events/zipFiles/' . $shindig->id . '_' . $time . '.zip');
        $headers = array(
            'Content-Description' => $shindig->id . '_' . $time . '.zip',
            'Content-Disposition' => 'attachment; filename = ' . basename($path),
            'Content-Type' => 'application/zip',
            'Content-Transfer-Encoding' => 'binary',
            'Expires' => '0',
            'Cache-Conrtol' => 'must-revalidate',
            'Pragma' => 'public',
            'Content-Length' => filesize($path),
            'File_Name' => $shindig->id . '_' . $time . '.zip',
        );
        return response()->download($path, 'Zip File', $headers);

        // dd($images);
        // return $images;
        // header('Content-Description: File Transfer');
        // header('Content-Type: application/octet-stream');
        // header('Content-Disposition: attachment; filename="' . basename($path) . '"');
        // header('Expires: 0');
        // header('Cache-Control: must-revalidate');
        // header('Pragma: public');
        // header('Content-Length: ' . filesize($path));
        // flush(); // Flush system output buffer
        // readfile($path);
    }

    public function deleteFile($file)
    {
        if (!empty($file)) {
            if (File::exists(public_path('events/zipFiles/' . $file))) {
                File::delete(public_path('events/zipFiles/' . $file));
                return response(200);
            } else {
                return response()->json([
                    'message' => 'File does not exists'
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'File can not be empty'
            ], 419);
        }
    }
    public function emailImages($id)
    {
        $user = Auth::user();
        $shindig = Shindig::findBySlug($id);
        // $replies = InboundSMS::where('messagingServiceSid', $shindig->messagingServiceSid)->where('shindig_id', $shindig->id)->get();
        $replies_recieved = $shindig->InboundSMS()->get();
        // dd($replies_recieved);

        $media = $replies_recieved->map(function ($reply) {
            return $reply->media()->get();
        });

        $images = [];
        $i = 0;
        //get all media that contains s3_filename
        foreach ($media as $md) {
            foreach ($md as $m) {
                // $url = $m->getS3URL();
                if (isset($m->s3_filename)) {
                    $images[$i] = $m->s3_filename;
                    $i++;
                }
            }
        }
        $msg_images = [];
        $j = 0;

        //get all the messages that contains media
        if ($shindig->messages()->get()) {
            $messages = $shindig->messages()->get();
            foreach ($messages as $md) {
                if (isset($md->media_url)) {
                    $msg_images[$j] = $md->media_url;
                    $j++;
                }
            }
        }
        //no media and mo messages then 
        if (count($images) < 1 && count($msg_images) < 1) {
            return response()->json([
                'message' => 'You do not have any image to download'
            ], 404);
        }

        $time = time();

        //create a zip file at server
        $zip = new Filesystem(new ZipArchiveAdapter(public_path('events/zipFiles/' . $shindig->id . '_' . $time . '.zip')));
        foreach ($images as $image) {
            $metaData = Storage::disk('s3')->getMetaData($image); //get meta data of image from server
            $extension = explode('/', $metaData['mimetype']);
            // dd($extension[1]);
            $fileContent = Storage::disk('s3')->get($image); //download image from server
            $zip->put(Str::random(4) . '.' . $extension[1], $fileContent); //put downloaded image to zip file
        }

        foreach ($msg_images as $image) {
            $extension = pathinfo($image, PATHINFO_EXTENSION); //get the meta data of image from server
            $fileContent = file_get_contents($image); //download the file
            $zip->put(Str::random(4) . '.' . $extension, $fileContent); //put that downloaded file into the zip
        }

        $zip->getAdapter()->getArchive()->close(); //close that zip file
        $path = public_path('events/zipFiles/' . $shindig->id . '_' . $time . '.zip');
        try {
            Mail::to($user->email)->send(new SendImages($shindig, 'TextMyGuests images', 'Please find the attached zip file which contains all the images in your chat for the shinding "' . $shindig->name . '"', $path));
            $headers = array(
                'Content-Description' => $shindig->id . '_' . $time . '.zip',
                'Content-Disposition' => 'attachment; filename = ' . basename($path),
                'Content-Type' => 'application/zip',
                'Content-Transfer-Encoding' => 'binary',
                'Expires' => '0',
                'Cache-Conrtol' => 'must-revalidate',
                'Pragma' => 'public',
                'Content-Length' => filesize($path),
                'File_Name' => $shindig->id . '_' . $time . '.zip',
            );
            $data = [
                'status' => 200,
                'message' => 'Images`s attachment send to your email'
            ];
            return response()->json($data)->header('File_Name', $shindig->id . '_' . $time . '.zip');
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
        }
        // $headers = array(
        //     'Content-Description' => $shindig->id . '_' . $time . '.zip',
        //     'Content-Disposition' => 'attachment; filename = ' . basename($path),
        //     'Content-Type' => 'application/zip',
        //     'Content-Transfer-Encoding' => 'binary',
        //     'Expires' => '0',
        //     'Cache-Conrtol' => 'must-revalidate',
        //     'Pragma' => 'public',
        //     'Content-Length' => filesize($path),
        //     'File_Name' => $shindig->id . '_' . $time . '.zip',
        // );
        // return response()->download($path, 'Zip File', $headers);

    }
}
