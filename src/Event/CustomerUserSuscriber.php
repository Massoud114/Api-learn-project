<?php


namespace App\Event;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSuscriber implements EventSubscriberInterface
{
	private $security;

	public function __construct(Security $security)
	{
		$this->security = $security;
	}

	/**
	 * @inheritDoc
	 */
	public static function getSubscribedEvents()
	{
		return [
			KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
		];
	}

	public function setUserForCustomer(ViewEvent $event)
	{
		$customer = $event->getControllerResult();
		if($customer instanceof Customer and $event->getRequest()->getMethod() === "POST"){
			$user = $this->security->getUser();
			$customer->setUser($user);
			//dd($customer);
		}

	}
}
