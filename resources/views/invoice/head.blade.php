<head>
	<meta charset="UTF-8">
	<title>TextMyGuests | Invoice</title>
	<meta name="csrf-token" conent="{{ csrf_token() }}">

	<style type="text/css">

	.clearfix:after {
		content: "";
		display: table;
		clear: both;
	}

	a {
		color: #002446;
		text-decoration: none;
	}

	body {
		position: relative;
		width: 18cm;
		height: 23cm;
		margin: 0 auto; 
		color: #555555;
		background: #FFFFFF; 
		font-family: Arial, sans-serif; 
		font-size: 14px; 
		font-family: SourceSansPro;
	}

	header {
		padding: 10px 0;
		margin-bottom: 20px;
		border-bottom: 1px solid #AAAAAA;
	}

	#logo {
		float: left;
		margin-top: 8px;
	}

	#logo img {
		height: 55px;
	}

	#company {
		text-align: right;
	}

	#details {
		margin-bottom: 50px;
	}

	#client {
		padding-left: 20px;
		border-left: 6px solid #002446;
		float: left;
	}

	#client .to {
	}

	h2.name {
		font-size: 1.4em;
		font-weight: normal;
		margin: 0;
	}

	#invoice {
		text-align: right;
	}

	#invoice h1 {
		color: #1b1f2a;
		font-size: 1.75em;
		line-height: 1;
		font-weight: normal;
		margin: 0  0 5px 0;
	}

	#invoice .date {
		font-size: 1.1em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		margin-bottom: 20px;
	}

	table th,
	table td {
		text-align: center;
		border-bottom: 1px solid #FFFFFF;
	}

	table th {
		background: rgba(0, 0, 0, 0.1);
		white-space: nowrap;        
		font-weight: 600;
		padding: 7px 20px;
	}

	table td {
		background: rgba(0, 0, 0, 0.04);
		padding: 10px 20px;
	}

	th.desc, td.desc {
		/* width: 90%; */
	}

	th.price, td.price {
		width: 1%;
		white-space: nowrap;
	}

	table td {
		text-align: right;
	}

	table td h3 {
		font-size: 1.1em;
		font-weight: 600;
		margin: 0 0 0.2em 0;
	}

	table .desc {
		text-align: left;
	}

	table .unit {
		background: #DDDDDD;
	}

	table .total {
	}

	table td.unit,
	table td.qty,
	table td.total {
		font-size: 1.2em;
	}

	table tbody tr:last-child td {
		border: none;
	}

	table tfoot td {
		padding: 10px 20px;
		background: #FFFFFF;
		border-bottom: none;
		font-size: 1.2em;
		white-space: nowrap; 
		border-top: 1px solid #AAAAAA; 
	}

	table tfoot tr:first-child td {
		border-top: none; 
	}

	table tfoot tr:last-child td {
		font-weight: 600;
		font-size: 1.2em;
		/* border-top: 1px solid #002446;  */
	}

	table tfoot tr td:first-child {
		border: none;
	}

	#thanks{
		font-size: 2em;
		margin-bottom: 50px;
	}

	#notices{
		padding-left: 6px;
		border-left: 6px solid #0087C3;  
	}

	#notices .notice {
		font-size: 1.2em;
	}

	/* footer {
		color: #777777;
		width: 100%;
		height: 30px;
		position: absolute;
		bottom: 0;
		border-top: 1px solid #AAAAAA;
		padding: 8px 0;
		text-align: center;
	} */
	</style>
</head>

