<?php

namespace App\Event;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSuscriber implements EventSubscriberInterface
{
	/**
	 * @var UserPasswordEncoderInterface
	 */
	private $encoder;

	public function __construct(UserPasswordEncoderInterface $encoder)
	{
		$this->encoder = $encoder;
	}

	public static function getSubscribedEvents()
	{
		return [
			KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
		];
	}

	public function encodePassword(ViewEvent $event){
		$result = $event->getControllerResult();
		$method = $event->getRequest()->getMethod();

		if($result instanceof User and $method === "POST") {
			$hash = $this->encoder->encodePassword($result, $result->getPassword());
			$result->setPassword($hash);
		}
	}
}
