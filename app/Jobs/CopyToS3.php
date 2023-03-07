<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Illuminate\Support\Facades\Storage;
use App\Media;

class CopyToS3 implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // hard code max 2 tries before failing to avoid stuck jobs
    public $tries = 2;

    public $media;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Media $theMedia)
    {
        $this->media = $theMedia;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Copy the media's Twilio URL to S3, and save the S3 URL to the Media object

        // We get the file content from twilio Url
        $client = new \GuzzleHttp\Client();
        $response = $client->get($this->media->twilio_url);
        $contents = $response->getBody();
        $filename = $this->media->shindig_id . '/' . $this->media->media_sid;

        // If the file is a video, convert it to mp4
        // TO DO

        // Store the file in our S3 bucket
        Storage::put($filename, $contents, [
            'visibility' => 'public',
            'mimetype' => $this->media->content_type
        ]);

        $this->media->s3_filename = $filename;
        $this->media->save();
    }
}
