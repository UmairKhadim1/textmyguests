<!DOCTYPE html>
<html lang="en">
@include('invoice.head')

<body>
    <header class="clearfix">
        <div id="logo">
            <img src="assets/images/live/TMG-Logo-Small.png">
        </div>
        <div id="company">
            <h2 class="name">TextMyGuests LLC</h2>
            <div>4444 South Blvd</div>
            <div>Charlotte, NC 28209</div>
            <div><a href="mailto:company@example.com">help@textmyguests.com</a></div>
        </div>
    </header>
    <main>
        <div id="details" class="clearfix">
            <div id="client">
                <div class="to">INVOICE TO:</div>
                <h2 class="name">{{ $client_name }}</h2>
                <div class="email"><a href="mailto:john@example.com">{{ $client_email }}</a></div>
            </div>
            <div id="invoice">
                <h1>INVOICE #{{ $invoice_id }}</h1>
                <div class="date">Date: {{ $created_at }}</div>
            </div>
        </div>
        <table cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th class="desc">Description</th>
                    <!-- <th class="unit">UNIT PRICE</th>
            <th class="qty">QUANTITY</th> -->
                    <th class="price">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($line_items as $i => $item)
                    <tr>
                        <td class="desc">
                            <h3>{{ $i === 0 ? $event_name : $item['name'] }}</h3>
                            @if ($i === 0)
                                {{ $item['name'] }}
                            @endif
                        </td>
                        <td class="price">
                            {{ $item['price'] >= 0 ? '$' . $item['price'] : '- $' . number_format($item['price'] * -1, 2) }}
                        </td>
                    </tr>
                @endforeach
                <?php
                $discount = number_format($total_price - $paid_amount, 2);
                ?>
                <tr>
                    <td class="desc">
                        <h3>Discount</h3>
                    </td>
                    <td class="price">{{ '- $' . $discount }}</td>
                </tr>
                <tr>
                    <td class="desc">
                        <h3>{{ $total_price > 0 ? 'Payment' : 'Refund' }}</h3>
                        {{ $total_price > 0 ? 'Paid on ' : 'Refunded on ' }}
                        {{ $paid_at }} with
                        {{ $card_type ? strtoupper($card_type) : 'card' }}
                        ending in {{ $card_last4 ? $card_last4 : '****' }}
                    </td>
                    <td class="price">
                        {{ $paid_amount >= 0 ? '- $' . $paid_amount : '$' . number_format($paid_amount * -1, 2) }}
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>TOTAL</td>
                    <td>${{ number_format($total_price - $paid_amount - $discount, 2) }}</td>
                </tr>
            </tfoot>
        </table>
        <div id="thanks">Thank you!</div>
    </main>
    <footer>

    </footer>
</body>

</html>
