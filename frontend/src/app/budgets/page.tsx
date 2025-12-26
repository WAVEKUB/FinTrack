"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Budget, BudgetInput, budgetService } from "@/services/budgetService";
import { Goal, GoalInput, goalService } from "@/services/goalService";
import { BudgetList } from "@/components/budgets/BudgetList";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { GoalList } from "@/components/goals/GoalList";
import { GoalForm } from "@/components/goals/GoalForm";
import { Modal } from "@/components/ui/Modal";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function BudgetsPage() {
    const [activeTab, setActiveTab] = useState<"budgets" | "goals">("budgets");
    const [isLoading, setIsLoading] = useState(true);

    // Data state
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);

    // Modal state
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [fetchedBudgets, fetchedGoals] = await Promise.all([
                budgetService.getBudgets(),
                goalService.getGoals(),
            ]);
            setBudgets(fetchedBudgets || []); // Ensure array
            setGoals(fetchedGoals || []); // Ensure array
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    // Budget Handlers
    const handleCreateBudget = async (data: BudgetInput) => {
        await budgetService.createBudget(data);
        setIsBudgetModalOpen(false);
        fetchData();
    };

    const handleUpdateBudget = async (data: BudgetInput) => {
        if (!editingBudget) return;
        await budgetService.updateBudget(editingBudget.ID, data);
        setIsBudgetModalOpen(false);
        setEditingBudget(undefined);
        fetchData();
    };

    const handleDeleteBudget = async (id: number) => {
        if (confirm("Are you sure you want to delete this budget?")) {
            try {
                await budgetService.deleteBudget(id);
                toast.success("Budget deleted");
                fetchData();
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete budget");
            }
        }
    };

    const openCreateBudget = () => {
        setEditingBudget(undefined);
        setIsBudgetModalOpen(true);
    };

    const openEditBudget = (budget: Budget) => {
        setEditingBudget(budget);
        setIsBudgetModalOpen(true);
    };

    // Goal Handlers
    const handleCreateGoal = async (data: GoalInput) => {
        await goalService.createGoal(data);
        setIsGoalModalOpen(false);
        fetchData();
    };

    const handleUpdateGoal = async (data: GoalInput) => {
        if (!editingGoal) return;
        await goalService.updateGoal(editingGoal.ID, data);
        setIsGoalModalOpen(false);
        setEditingGoal(undefined);
        fetchData();
    };

    const handleDeleteGoal = async (id: number) => {
        if (confirm("Are you sure you want to delete this goal?")) {
            try {
                await goalService.deleteGoal(id);
                toast.success("Goal deleted");
                fetchData();
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete goal");
            }
        }
    };

    const openCreateGoal = () => {
        setEditingGoal(undefined);
        setIsGoalModalOpen(true);
    };

    const openEditGoal = (goal: Goal) => {
        setEditingGoal(goal);
        setIsGoalModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Budgets & Goals
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Manage your spending limits and savings goals
                        </p>
                    </div>
                    <button
                        onClick={activeTab === "budgets" ? openCreateBudget : openCreateGoal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add {activeTab === "budgets" ? "Budget" : "Goal"}
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-zinc-800">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab("budgets")}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === "budgets"
                                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"}
                            `}
                        >
                            Budgets
                        </button>
                        <button
                            onClick={() => setActiveTab("goals")}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === "goals"
                                    ? "border-green-500 text-green-600 dark:text-green-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"}
                            `}
                        >
                            Savings Goals
                        </button>
                    </nav>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === "budgets" && (
                            <BudgetList
                                budgets={budgets}
                                onEdit={openEditBudget}
                                onDelete={handleDeleteBudget}
                            />
                        )}
                        {activeTab === "goals" && (
                            <GoalList
                                goals={goals}
                                onEdit={openEditGoal}
                                onDelete={handleDeleteGoal}
                            />
                        )}
                    </>
                )}

                {/* Modals */}
                <Modal
                    isOpen={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                    title={editingBudget ? "Edit Budget" : "Create Budget"}
                >
                    <BudgetForm
                        initialData={editingBudget}
                        onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
                        onCancel={() => setIsBudgetModalOpen(false)}
                    />
                </Modal>

                <Modal
                    isOpen={isGoalModalOpen}
                    onClose={() => setIsGoalModalOpen(false)}
                    title={editingGoal ? "Edit Goal" : "Create Goal"}
                >
                    <GoalForm
                        initialData={editingGoal}
                        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
                        onCancel={() => setIsGoalModalOpen(false)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
}
