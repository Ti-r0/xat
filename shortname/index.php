<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Xat Price Tracker</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .price-up { color: green; }
        .price-down { color: red; }
    </style>
</head>
<body>
<div class="container">
    <h1>Xat Price Tracker</h1>
    <form action="update_data.php" method="POST">
        <label for="username">Enter Shortname:</label>
        <input type="text" id="username" name="username" required>
        <button type="submit">Check Price</button>
    </form>

    <?php
    $data_file = "data.json";

    function load_data() {
        global $data_file;
        if (file_exists($data_file)) {
            $json = file_get_contents($data_file);
            return json_decode($json, true);
        } else {
            return [];
        }
    }

    function display_price_changes($username) {
        $all_data = load_data();
        foreach ($all_data as $entry) {
            if ($entry['wantedname'] == $username) {
                $price_class = $entry['price_change'] > 0 ? "price-up" : ($entry['price_change'] < 0 ? "price-down" : "");
                echo "<h2>Results for {$entry['wantedname']}</h2>";
                echo "<p>Current Price: {$entry['xats']} xats</p>";
                echo "<p class='{$price_class}'>Price Change: {$entry['price_change']} xats</p>";
                echo "<p>Last Updated: {$entry['date']}</p>";
                return;
            }
        }
        echo "<p>No data found for the username.</p>";
    }

    if (isset($_GET['username'])) {
        $username = $_GET['username'];
        display_price_changes($username);
    }
    ?>
</div>
</body>
</html>
