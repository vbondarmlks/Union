(function($) {
    $.fn.plansTable = function() {

        return this.each(function(){

            var $this = $(this);
            var checkboxes = $('.compare [type="checkbox"]', $this);
            var rowCount = $('.heading .plans-table-cell', $this).length
            var leftColumnIndex = 2; // set to 1 if first column needs to be scrolled too
            var rightColumnIndex;
            var $parentCell;
            var selectedColumns = [];
            var columnCheckedIndex;

            // methods
            function scrollTable () {
                if ($(this).hasClass('right')) { // scrolling right
                    rightColumnIndex = leftColumnIndex + 4;

                    if (rightColumnIndex > rowCount) return false;

                    $('.plans-table-cell:nth-child('+ leftColumnIndex + ')', $this).hide();
                    $('.plans-table-cell:nth-child('+ rightColumnIndex + ')', $this).show();
                    leftColumnIndex++;
                } else {    // scrolling left
                    if (leftColumnIndex == 2) return false;
                    leftColumnIndex--;

                    $('.plans-table-cell:nth-child('+ leftColumnIndex + ')', $this).show();
                    $('.plans-table-cell:nth-child('+ rightColumnIndex + ')', $this).hide();
                }
            }

            function unselectAll (event) {
                event.preventDefault();
                event.stopPropagation();
                checkboxes.prop('checked', false).attr('disabled', false);
                $('.compare .plans-table-cell.checked', $this).removeClass('checked');
                selectedColumns = [];
            }

            function addToComparison (event) {
                $parentCell = $(event.target).parents('.plans-table-cell');
                columnCheckedIndex = $parentCell.index();

                if ($parentCell.hasClass('checked')) {  // already checked
                    selectedColumns.splice(selectedColumns.indexOf(columnCheckedIndex), 1);
                    $('.compare .plans-table-cell input[type="checkbox"]:not(:checked)', $this).attr('disabled', false);
                } else {
                    if (selectedColumns.length  < 2) {  // 3 plans selected max
                        selectedColumns.push(columnCheckedIndex);
                    } else if (selectedColumns.length  == 2) {
                        selectedColumns.push(columnCheckedIndex);
                        $('.compare .plans-table-cell input[type="checkbox"]:not(:checked)', $this).attr('disabled', true);
                    }
                }
                $parentCell.toggleClass('checked');
            }

            function compare (event) {
                event.preventDefault();
                event.stopPropagation();

                if (selectedColumns.length == 0) { return } // no plans selected

                if ($this.hasClass('comparing')) { // already comparing
                    // bring first 4 plans back
                    $('.plans-table-row .plans-table-cell:nth-child(6)',$this).prevAll().css('display', 'block');
                    leftColumnIndex = 2; // resetting table scrolling
                } else {
                    // show only selected plans
                    $('.plans-table-row .plans-table-cell:nth-child(1)',$this).nextAll().css('display', 'none');
                    $.each(selectedColumns, function(item, value){
                        $('.plans-table-row .plans-table-cell:nth-child('+ ++value +')', $this).show();
                    });
                }

                // change buttons
                $('.compare, .table-buttons, .plans-table-scroll', $this).toggle();
                $('.compare-buttons', $this).toggle();
                $this.toggleClass('comparing');
            }

            // events
            $('.plans-table-scroll', $this).bind('click', scrollTable);
            $('.plans-table-unselect', $this).bind('click', unselectAll);
            $('.compare .plans-table-cell input[type="checkbox"]', $this).bind('change', addToComparison);
            $('.plans-table-compare, .plans-table-compare-reset', $this).bind('click', compare);


            // hide all rows after 5th on start-up
            $('.plans-table-row .plans-table-cell:nth-child(5)',$this).nextAll().css('display', 'none');
        });

    };
})(jQuery);


$(document).ready(function(){
    $('.plans-table').plansTable();
});

