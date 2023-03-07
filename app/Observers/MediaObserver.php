<?php

namespace App\Observers;

use App\Media;
use Illuminate\Support\Facades\Storage;

class MediaObserver
{
	public function deleted(Media $media)
	{
		// remove s3 files for this media
		Storage::delete($this->s3_filename);
	}
}