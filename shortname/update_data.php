<?php
$api_url = "https://illuxat.com/api/shortname/";
$data_file = "data.json";

function fetch_data($username) {
    global $api_url;
    $url = $api_url . $username;
    $response = file_get_contents($url);
    return json_decode($response, true);
}

function load_data() {
    global $data_file;
    if (file_exists($data_file)) {
        $json = file_get_contents($data_file);
        return json_decode($json, true);
    } else {
        return [];
    }
}

function save_data($data) {
    global $data_file;
    $json = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($data_file, $json);
}

function find_previous_entry($data, $username) {
    foreach ($data as &$entry) {
        if ($entry['wantedname'] == $username) {
            return $entry;
        }
    }
    return null;
}

function update_data($username) {
    $new_data = fetch_data($username);
    if ($new_data && isset($new_data['data']['xats'])) {
        $all_data = load_data();
        $previous_entry = find_previous_entry($all_data, $username);
        $current_price = $new_data['data']['xats'];
        $current_date = date("Y-m-d H:i:s");
        $new_entry = [
            "wantedname" => $username,
            "xats" => $current_price,
            "date" => $current_date,
            "price_change" => "0"
        ];
        
        if ($previous_entry) {
            $price_diff = $current_price - $previous_entry['xats'];
            $price_change = ($price_diff > 0 ? "+" : "") . $price_diff;
            $new_entry['price_change'] = $price_change;
            $previous_entry = $new_entry;
        } else {
            $all_data[] = $new_entry;
        }
        
        save_data($all_data);
        return $new_entry;
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $updated_entry = update_data($username);
    header("Location: index.php?username=" . $username);
    exit();
}
?>
