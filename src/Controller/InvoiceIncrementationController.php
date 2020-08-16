<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\Common\Persistence\ManagerRegistry;

class InvoiceIncrementationController
{
	/**
	 * @var ManagerRegistry
	 */
	private $manager;

	/**
	 * InvoiceIncrementationController constructor.
	 * @param ManagerRegistry $registry
	 */
	public function __construct(ManagerRegistry $registry)
	{
		$this->manager = $registry->getManager();
	}

	public function __invoke(Invoice $data)
	{
		$data->setChrono($data->getChrono() + 1);
		$this->manager->flush();
		return $data;
	}
}
