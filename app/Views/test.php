<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>jQuery UI Sortable - Default functionality</title>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="/resources/demos/style.css">
    <style>
        #sortable {
            list-style-type: none;
            margin: 0;
            padding: 0;
            width: 60%;
        }

        #sortable li {
            margin: 0 3px 3px 3px;
            padding: 0.4em;
            padding-left: 1.5em;
            font-size: 1.4em;
            height: 18px;
        }

        #sortable li span {
            position: absolute;
            margin-left: -1.3em;
        }

        .ui-state-default {
            background-color: silver;
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script>
        // $(function() {
        //     $("#sortable").sortable({
        //         axis: 'y',
        //         update: function(event, ui) {
        //             var data = $(this).sortable('serialize');

        //             // POST to server using $.post or $.ajax
        //             $.ajax({
        //                 data: data,
        //                 type: 'POST',
        //                 url: '<?= route_to('sort') ?>'
        //             });
        //         }
        //     });
        // });
        $(function() {
            $("#sortable").sortable({
                cursor: "move",
                revert: true,
                opacity: 0.8,
            });
        });
    </script>
</head>

<body>
    <!-- $( ".selector" ).sortable( "instance" ); 

serialize( options )
-->
    <ul id="sortable">
        <?php for($i=1;$i<=100;$i++): ?>
        <li class="ui-state-default" id="id-<?=$i?>"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Item <?=$i?></li>
        <?php endfor; ?>
    </ul>


</body>

</html>