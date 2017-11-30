'use strict';

function em(numberOfEms) {
    var currentEmSize = parseFloat($('body').css('font-size'));
    return (currentEmSize * numberOfEms);
}

var mcsas = angular.module('mcsas', []);

mcsas.controller('NotesController', function ($scope, $http) {

    $scope.upvotednotes = [];
    $scope.trendingnotes = [];
    $scope.likenotes = [];
    $scope.recentnotes = [];

    $scope.notes = [];
    $scope.initForActivity = function () {
        //Get all notes for user
        var userNotes = [];
        $http({
            url: '/getnotesbytag/',
            method: 'GET'
        }).success(function (response) {
            userNotes = response;
            //Have to update the chart series data:
            for (var i = 0; i < userNotes.length; i++) {
                $scope.notes.push(userNotes[i].fields);
            }
        });
        console.log("all scope notes from server", $scope.notes);


        $http.get('../static/jsonData/AdaptiveCheatSheetData.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "upvoted notes");
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    $scope.upvotednotes.push(service[i]);
                }
            });

        $http.get('../static/jsonData/trendingNotes.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "trendingnotes ");
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    $scope.trendingnotes.push(service[i]);
                }
            });

        $http.get('../static/jsonData/likeNotes.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "likenotes notes");
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    $scope.likenotes.push(service[i]);
                }
            });

        $http.get('../static/jsonData/recentNotes.json')
            .then(function (jsonData) {
                var service = jsonData.data;
                console.log(service, "recentnotes notes");
                //Have to update the chart series data:
                for (var i = 0; i < service.length; i++) {
                    $scope.recentnotes.push(service[i]);
                }
            });


    };

    console.log($scope.recentnotes, "new updated recent notes");


    $scope.initForActivity();
    var notesContainer;

    $scope.recycle = JSON.parse(localStorage.getItem('notes-recycle'));
    $scope.noteMessage = '';
    $scope.noteTags = '';
    $scope.noteTitle = '';
    $scope.noteId = 0;
    $scope.submitButton = 'Add';
    $scope.rbOrder = 'date';
    $scope.rbSelectBtn = "Select All";
    $scope.rbSelect = true;
    $scope.rbChildBtns = true;

    if ($scope.recycle == null || $scope.recycle.length < 1) {
        $scope.recycle = [];
        $scope.rbSelect = true;
    }

    $scope.submitNote = function () {
        if ($scope.noteId > 0) {
            this.editNote();
        } else {
            this.addNote();
        }
    };

//Adding note prod code ready with backend api
    $scope.addNote = function () {

        console.log("while adding ntoes existing notes", $scope.notes);

        var noteObject = new Object();
        noteObject.title = $scope.noteTitle;
        noteObject.tags = $scope.noteTags;
        noteObject.content = $scope.noteMessage;

        var noteData = {"title": $scope.noteTitle, "tags": $scope.noteTags, "content": $scope.noteMessage};
        $scope.notes.push(noteData);
        console.log("new notedata is : ", noteData);
        $http({
            url: '/addnotes/',
            method: 'POST',
            data: noteObject
        }).success(function (response) {
            console.log(response);
        });

        notesContainer.sortable('refresh');
        $scope.noteMessage = '';
        $scope.noteTitle = '';
        $scope.noteTags = '';
        this.flashSuccessSave();
    };

    $scope.editNote = function () {
        var len = $scope.notes.length;

        for (var i = 0; i < len; i++) {
            if ($scope.notes[i].note_id == $scope.noteId) {
                $scope.notes[i].title = $scope.noteTitle;
                $scope.notes[i].content = $scope.noteMessage;
                break;
            }
        }

        $scope.noteMessage = '';
        $scope.noteTitle = '';
        $scope.noteId = 0;

        notesContainer.sortable('refresh');                             // not sure if this call is required
        this.flashSuccessSave();
    }

    $scope.deleteNote = function (id) {
        var note = {"title": "", "tag": "", "content": "", "selected": false};
        var index;
        var len = $scope.notes.length;

        for (var i = 0; i < len; i++) {              // I think jquery filter() would work here, instead of for loop
            if ($scope.notes[i].note_id == id) {
                index = i;
                note.title = $scope.notes[i].title; // there is definately a better way
                note.tag = $scope.notes[i].tag;  // to building this note
                note.content = $scope.notes[i].content;
                break;
            }
        }

        $scope.notes.splice(index, 1);
        // localStorage.setItem('notes', JSON.stringify($scope.notes));

        $scope.recycle.push(note);                  // just to see it work
        localStorage.setItem('notes-recycle', JSON.stringify($scope.recycle));
        $scope.rbSelect = false;
    }

    $scope.dragStart = function (e, ui) {
        ui.item.data('start', ui.item.index());
    }

    $scope.dragEnd = function (e, ui) {
        var start = ui.item.data('start'),
            end = ui.item.index();

        $scope.notes.splice(end, 0, $scope.notes.splice(start, 1)[0]);
        $scope.$apply();

        localStorage.setItem("notes", JSON.stringify($scope.notes));
    }

    $scope.selectAll = function () {
        if ($scope.rbSelectBtn == "Select All") {
            var i,
                len = $scope.recycle.length;

            for (i = 0; i < len; i++) {
                $scope.recycle[i].selected = true;
            }

            $scope.rbSelectBtn = "Deselect All";
            $scope.rbChildBtns = false;
        } else {
            $scope.deselectAll();
        }
    }

    $scope.deselectAll = function () {
        var i,
            len = $scope.recycle.length;

        for (i = 0; i < len; i++) {
            $scope.recycle[i].selected = false;
        }

        $scope.rbSelectBtn = "Select All";
        $scope.rbChildBtns = true;
    }

    $scope.setChildBtns = function () {
        var disabled = true,
            i,
            len = $scope.recycle.length;

        for (i = 0; i < len; i++) {
            if ($scope.recycle[i].selected == true) {
                disabled = false;
                break;
            }
        }

        $scope.rbChildBtns = disabled;
    }

    $scope.permDelNotes = function () {
        var oldNotes = $scope.recycle;
        $scope.recycle = [];

        angular.forEach(oldNotes, function (note) {
            if (!note.selected) {
                $scope.recycle.push(note);
            }
        });

        localStorage.setItem('notes-recycle', JSON.stringify($scope.recycle));
        $scope.rbSelectBtn = "Select All";
        if ($scope.recycle == null || $scope.recycle.length < 1) {
            $scope.rbSelect = true;
        }
        $scope.setChildBtns();
    }

    $scope.restoreNote = function () {
        var oldNotes = $scope.recycle;
        $scope.recycle = [];

        angular.forEach(oldNotes, function (note) {
            if (!note.selected) {
                $scope.recycle.push(note);
            } else {
                $scope.notes.push(note);
            }
        });

        localStorage.setItem('notes', JSON.stringify($scope.notes));
        localStorage.setItem('notes-recycle', JSON.stringify($scope.recycle));
        $scope.rbSelectBtn = "Select All";
        if ($scope.recycle == null || $scope.recycle.length < 1) {
            $scope.rbSelect = true;
        }
        $scope.setChildBtns();
    }

    notesContainer = $('#notesContainer').sortable({
        containment: "window",
        cursor: "move",
        cursorAt: {left: em(7), top: em(1)},
        items: "> li",
        opacity: 0.85,
        revert: true,
        tolerance: "pointer",
        start: $scope.dragStart,
        update: $scope.dragEnd
    });

    $scope.showAddNoteForm = function () {
        $scope.noteMessage = '';
        $scope.noteTitle = '';
        $scope.submitButton = 'Add';

        $('#formWrapper').slideToggle();
        $('#formWrapper textarea').focus();
    }

// Edit note call to update the call.
    $scope.showEditNoteForm = function (note) {

        $scope.noteMessage = note.content;
        $scope.noteTitle = note.title;
        $scope.note_id = note.note_id;
        $scope.submitButton = 'Update';

        $('#formWrapper').slideToggle();
        $('#formWrapper textarea').focus();
    }

    $scope.closeAddNoteForm = function () {
        $scope.noteMessage = '';
        $scope.noteTitle = '';
        $scope.noteId = 0;
        $('#formWrapper').slideToggle();
    }

    $scope.flashSuccessSave = function () {
        $('#success').addClass('success-show');
        setTimeout(function () {
            $('#success').removeClass('success-show');
            setTimeout(function () {
                $('#formWrapper').slideToggle();
            }, 500);
        }, 1500);
    }

    $scope.animateDeleteNote = function (id) {
        var li = document.getElementById(id);

        $(li).effect("transfer", {to: $('#trashBin')}, 750);
        $('.ui-effects-transfer').css({
            'background-color': $(li).css('background-color'),
            'z-index': 999
        });

        this.deleteNote(id);
    }

    $scope.toggleHelp = function () {
        $('#help').toggle("slide", {direction: "right"});
    }

    $scope.showAboutDialog = function () {
        $('#aboutWindow').dialog({
            closeText: "",
            draggable: false,
            minWidth: em(30),
            modal: true,
            resizable: false,
            buttons: {
                OK: function () {
                    $(this).dialog("close");
                }
            }
        });

        $('.ui-dialog-content').addClass('clearfix');
        $('.ui-dialog-buttonset button').addClass('btn');
    }

    $scope.closeAboutDialog = function () {
        $('#aboutWindow').dialog("close");
    }

    $scope.toggleRecycleBin = function () {
        $('#recycleBin').slideToggle();
    }

    $(document).bind('keydown', function (e) {
        if (e.which === 27) {
            if ($('div#help').is(':visible')) {
                $scope.toggleHelp();
            }
            if ($('#formWrapper').is(':visible')) {
                $scope.closeAddNoteForm();
            }
            if ($('#recycleBin').is(':visible')) {
                $scope.toggleRecycleBin();
            }
        }
    })

})
;
