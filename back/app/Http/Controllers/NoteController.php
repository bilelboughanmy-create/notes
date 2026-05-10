<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()
            ->notes()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:100',
            'content'  => 'nullable|string',
            'priority' => 'required|in:basse,moyenne,haute',
        ]);

        $note = $request->user()->notes()->create($validated);

        return response()->json([
            'message' => 'Note créée avec succès.',
            'note'    => $note,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);
        return response()->json($note);
    }

    public function update(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);

        $validated = $request->validate([
            'title'    => 'required|string|max:100',
            'content'  => 'nullable|string',
            'priority' => 'required|in:basse,moyenne,haute',
        ]);

        $note->update($validated);

        return response()->json([
            'message' => 'Note mise à jour avec succès.',
            'note'    => $note,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $note = $request->user()->notes()->findOrFail($id);
        $note->delete();

        return response()->json(['message' => 'Note supprimée avec succès.']);
    }
}
