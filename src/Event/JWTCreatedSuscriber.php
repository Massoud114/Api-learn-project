<?php


namespace App\Event;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedSuscriber
{
	public function updateJWTData(JWTCreatedEvent $event){
		$user = $event->getUser();

		$data = $event->getData();

		$data['firstName'] = $user->getFirstName();
		$data['lastName'] = $user->getLastName();

		$event->setData($data);
	}
}
