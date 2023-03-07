<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Fico7489\Laravel\Pivot\Traits\PivotEventTrait;
use App\GroupMembership;
use App\Group;

class Guest extends Model
{
    use PivotEventTrait;

    public $timestamps = false;
    protected $guarded = [];

    public static function boot()
    {
        parent::boot();

        // This is a safe guard ensuring that we never remove a guest
        // from the 'All guests' group.
        static::pivotDetached(function ($model, $relationName, $pivotIds) {
            foreach ($pivotIds as $group_id) {
                if (Group::find($group_id)->is_all) {
                    GroupMembership::create(['guest_id' => $model->id, 'group_id' => $group_id]);
                }
            }
        });
    }

    public function shindig()
    {
        return $this->belongsTo('App\Shindig');
    }

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'group_membership');
    }

    public function addToGroup($group_id)
    {
        return \App\GroupMembership::create(['guest_id' => $this->id, 'group_id' => $group_id]);
    }
}
