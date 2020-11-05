<?php


namespace App\Event;


use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSuscriber implements \Symfony\Component\EventDispatcher\EventSubscriberInterface
{
	private $security;
	private $repository;

	public function __construct(Security $security, InvoiceRepository $repository)
	{
		$this->security = $security;
		$this->repository = $repository;
	}

	/**
	 * @inheritDoc
	 */
	public static function getSubscribedEvents()
	{
		return[
			KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
		];
	}

	public function setChronoForInvoice(ViewEvent $event){
		$invoice = $event->getControllerResult();

		if($invoice instanceof Invoice and $event->getRequest()->getMethod() === "POST"){
			$nextChrono = $this->repository->findNextChrono($this->security->getUser());
			$invoice->setChrono($nextChrono);
		}
	}
}
