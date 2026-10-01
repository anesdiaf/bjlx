export default function PaymentAndShippingPage() {
    return (
        <div className="space-y-10">
            <h1 className="text-xl">Livraison et paiement</h1>
            <div className="space-y-6">
                <div className="space-y-3">
                    <h3 className="font-medium">1. Livraison</h3>
                    <ul className="list-decimal pl-15 space-y-2">
                        <li>Les frais de livraison sont estimés en ligne lors de la finalisation d'une commande ou de l'achat direct d'un produit.</li>
                        <li>L'estimation est basée sur la destination de la livraison.</li>
                        <li>Nous livrons Les commandes partout en Algérie sur 69 Willaya</li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="font-medium">2. Méthodes de livraison</h3>
                    <ul className="list-decimal pl-15 space-y-2">
                        <li>Un coursier peut livrer votre commande directement à votre porte.</li>
                        <li>Vous pouvez également recevoir votre commande dans l'un des centres de retrait client</li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="font-medium">3. Paiement</h3>
                    <ul className="list-decimal pl-15 space-y-2">
                        <li>Payez le livreur à la livraison.</li>
                        <li>Nous ne proposons qu'un seul mode de paiement : le paiement à la livraison.<br/>C'est la solution la plus sûre pour nos clients, puisque vous ne payez qu'à la réception du produit.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}