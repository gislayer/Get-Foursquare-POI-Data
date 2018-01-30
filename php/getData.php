<?php
/**
 * Created by PhpStorm.
 * User: alikilic
 * Date: 12.12.2016
 * Time: 00:34
 */

$client_id = @$_POST["client_id"];
$client_secret= @$_POST["client_secret"];
$v = @$_POST["v"];
$limit= @$_POST["limit"];
$radius = @$_POST["radius"];
$oauth_token = @$_POST["oauth_token"];
$categoryId = @$_POST["categoryId"];
$enlem = @$_POST["lat"];
$boylam = @$_POST["lng"];
$link = 'https://api.foursquare.com/v2/venues/search?ll='.$enlem.','.$boylam.'&client_id='.$client_id.'&limit='.$limit.'&client_secret='.$client_secret.'&radius='.$radius.'&categoryId='.$categoryId.'&v='.$v.'';
$site = file_get_contents($link);
echo $site;
?>