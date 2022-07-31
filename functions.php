<?php
 
/* Custom script with no dependencies, enqueued in the header */
add_action('wp_enqueue_scripts', 'custom_enqueue_custom_js');
function custom_enqueue_custom_js() {
    wp_enqueue_script('custom', get_stylesheet_directory_uri().'/scripts/custom.js');
}


function product_list_without_price( $atts ) {
    $pro_slug_array = array();
    
    if(isset($atts['slug']) && !empty($atts['slug'])){
        $pro_slug_array = explode(",",$atts['slug']);
    }

    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => -1,
         'tax_query' => array(
            array(
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms'    => $pro_slug_array,
                'operator' => 'AND',
            )
        )
    );

    

   // $args['product_cat'] = $pro_slug_array;

    $loop = new WP_Query( $args );
    ob_start();
    ?>

    <div class="variant-radios">
    <input type="radio" id="onedozeninput" name="Size" value="One Dozen" checked="">
    <input type="radio" id="halfdozeninput" name="Size" value="Half Dozen">
    </div>

   <div class="row custom_choose_product_list choose-your-own-wrapper">
      
    <?php
    while ( $loop->have_posts() ) : $loop->the_post();
        global $product;
        $product_id = get_the_id();
        $variation_product = wc_get_product( $product_id );

        if( !$product->is_type('variable') ){
            continue;
        }
        
        $regular_price = $product->get_regular_price();
        $sale_price = $variation_product->get_sale_price();
        $pprice = $variation_product->get_price();
        ?>

        <div class="col-4 choose__your__own__single__cookie_wrapper">
            <div class="cproduct" id="p<?php echo $product_id; ?>">
                  <!-- <img width="612" height="408" src="" alt="" loading="lazy">   -->
                  <?php woocommerce_get_product_thumbnail(); ?>
                  
                    <img width="400" height="400" src="<?php echo the_post_thumbnail_url(); ?>" class="attachment-woocommerce_thumbnail size-woocommerce_thumbnail wp-post-image" alt="" loading="lazy">
                    <a href="<?php echo get_permalink(); ?>">
                        <p class="producttitle" data-id="<?php echo $product_id; ?>"><?php echo get_the_title(); ?></p>
                    </a>

                    <div class="quantity " id="pq<?php echo $product_id; ?>" data-min="0" data-max="670" data-step="1" data-value="0" data-id="<?php echo $product_id; ?>" data-name="<?php echo get_the_title(); ?>">
                        <input class="cminus qty_changer_cookie_choose__your__own" type="button" value="-" data-qty_action="decrease">
                        <input type="number" id="quantity_62dd2f6c37af6" class="input-text qty text quantity__input custom__quantity__input" step="1" min="0" max="670" name="quantity" value="0" title="Qty" size="4" placeholder="" inputmode="numeric">
                        <input class="cplus qty_changer_cookie_choose__your__own" type="button" value="+" data-qty_action="increase">   
                    </div>
            </div>
       </div>

    <?php
    endwhile;
    ?>          
       </div>
    <?php
    wp_reset_query();
   $content = ob_get_clean(); 
     return $content ;

}
add_shortcode( 'product_list_without_price', 'product_list_without_price' );



/**
 * Add a custom text input field to the product page
 */
function plugin_republic_add_text_field() { 
     if ( is_product() && has_term( array( 'custom'), 'product_cat' ) ) {
        echo "<input type='hidden' name='picked_cookies' id='picked_cookies' value=''>";
     }
}
add_action( 'woocommerce_before_add_to_cart_button', 'plugin_republic_add_text_field' );



// Add "picked_cookies" as custom cart item data
add_filter( 'woocommerce_add_cart_item_data', 'add_cart_item_custom_data', 20, 2 );
function add_cart_item_custom_data( $cart_item_data, $product_id ) {
    if( isset($_POST['picked_cookies']) && ! empty($_POST['picked_cookies']) ){
        $cart_item_data['custom_picked_cookies'] = sanitize_text_field( $_POST['picked_cookies'] );
    }
    return $cart_item_data;
}

// Display "picked_cookies" in cart and checkout
add_filter( 'woocommerce_get_item_data', 'display_picked_cookies_in_cart_checkout', 20, 2 );
function display_picked_cookies_in_cart_checkout( $cart_item_data, $cart_item ) {
    if( isset($cart_item['custom_picked_cookies']) ){
        $cart_item_data[] = array(
            'name' => __('Picked Cookies'),
            'value' => $cart_item['custom_picked_cookies'],
        );
    }
    return $cart_item_data;
}

// Save "picked_cookies" as custom order item meta data
add_action( 'woocommerce_checkout_create_order_line_item', 'update_order_item_meta', 20, 4 );
function update_order_item_meta( $item, $cart_item_key, $values, $order ) {
    if( isset($values['custom_picked_cookies']) )
        $item->update_meta_data( 'picked_cookies', $values['custom_picked_cookies'] );
}