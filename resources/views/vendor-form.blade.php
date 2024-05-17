<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <title>Surat Pemesanan</title>
</head>

<style>
   .table img {
        max-width: 150px;
        max-height: 150px;
        margin: 6px;
    }

    .detail {
        min-width: 350px;

    }

    .table,
    th,
    tr,
    td {
        text-align: center;
        border: 1px solid #000;

    }
    h2{
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    .logo{
        width: 100px;
        height: 60px;
        margin-bottom: 10px;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        display: block;

    }
</style>

<body>
    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('asset/image/Gloeshoes 2.png'))) }}"
    alt="" class="logo">
    <h2>Surat Pemesanan</h2>
    <div class="row">
        <div class="detail">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Product</th>
                        <th>Notes</th>
                        <th>Size</th>
                        <th>Warna</th>
                        <th>Quantity</th>
                        <th>Nama Customer</th>
                        <th>Gambar Produk</th>
                    </tr>

                </thead>
                <tbody>
                    @php
                        $no = 1;
                    @endphp
                            @foreach ($allData as $item)
                            <tr>
                                <td>{{$no++}}</td>
                                <td>{{ $item['productName'] }}</td>
                                <td>{{ $item['notes'] }}</td>
                                <td>{{ $item['size'] }}</td>
                                <td>{{ $item['color'] }}</td>
                                <td>{{ $item['quantity'] }}</td>
                                <td>{{ $item['customerName'] }}</td>
                                <td><img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('/storage/images/' . $item['image']))) }}"
                                        alt=""></td>
                            </tr>
                            @endforeach
                        </tbody>

                    </table>
                </div>

            </div>
        </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
    </script>



</body>

</html>
