<?php

namespace App\Http\Controllers;


use App\Models\Todo;
use Illuminate\Http\Request;

class TodosController extends Controller
{
    /**
     * Retrieve and return all Todo items.
     */
    public function index()
    {
        $todos = Todo::all();
        return response()->json($todos);
    }

    /**
     * Store a new Todo item in the database.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:pending,completed,canceled', // Example status options
            // 'user_ID' => 'required|exists:users,id' // Ensure user_ID is valid
        ], [
            'title.required' => 'The title is required.',
            'description.required' => 'The description is required.',
            'status.in' => 'The status must be either pending, completed, or canceled.',
            // 'user_ID.required' => 'The user ID is required.',
            // 'user_ID.exists' => 'The user ID must exist in the users table.'
        ]);

        $todo = new Todo([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
            // 'user_ID' => $request->input('user_ID') // Add user_ID here
        ]);

        $todo->save();

        return response()->json('Todo item created successfully!');
    }

    /**
     * Update an existing Todo item.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|string|in:pending,completed,canceled', // Example status options
            // 'user_ID' => 'required|exists:users,id' // Ensure user_ID is valid
        ]);

        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
            'user_ID' => $request->input('user_ID') // Update user_ID here
        ]);

        return response()->json('Todo updated successfully');
    }

    /**
     * Soft delete a Todo item.
     * This method marks the Todo as deleted without removing it from the database.
     */
    public function softDelete($id)
    {
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo soft deleted']);
    }

    /**
     * Retrieve and return all soft-deleted Todo items.
     */
    public function showSoftDeleted()
    {
        $softDeletedTodos = Todo::onlyTrashed()->get();

        return response()->json(['soft_deleted_todos' => $softDeletedTodos]);
    }

    /**
     * Restore a soft-deleted Todo item.
     */
    public function restore($id)
    {
        $todo = Todo::withTrashed()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->restore();

        return response()->json(['message' => 'Todo restored successfully']);
    }

    /**
     * Permanently delete a Todo item.
     * This method removes the Todo from the database permanently.
     */
    public function forceDelete($id)
    {
        $todo = Todo::withTrashed()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }

        $todo->forceDelete();

        return response()->json(['message' => 'Todo permanently deleted']);
    }
}

