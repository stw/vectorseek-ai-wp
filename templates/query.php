<?php ?>

<style>
.d-none {
    display: none;
}

</style>

<div class="row" id="error"/>

<div class="row" id="query-row">
    <div class="col" >
        <form class="">
            <input class="" id="vectorseek-query" placeholder="" value="" type="search" name="query" required />
            <button class="" type="submit" aria-label='Search' id="vectorseek_submit">Query</button>
            <br/><br/>
            <img class="spinner d-none" height="30" width="30" src="/wp-content/plugins/vectorseek.ai/images/loading.gif"/>
        </form>
    </div>
</div>

<div class="row">
    <div id="log" class="col-12 results">
    </div>
</div>

<div class="row d-none">
    <div id="context" class="col-12 context">
    </div>
</div>


<script type="text/javascript">
//    const ws_url = '<?php echo get_option('vectorseek_host'); ?>';
//    const project = <?php echo get_option('vectorseek_project'); ?>;
//    const context = <?php echo get_option('vectorseek_context'); ?>;
</script>
