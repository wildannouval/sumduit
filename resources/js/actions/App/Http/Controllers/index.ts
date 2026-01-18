import DashboardController from './DashboardController'
import WalletTransferController from './WalletTransferController'
import WalletController from './WalletController'
import TransactionController from './TransactionController'
import CategoryController from './CategoryController'
import BudgetController from './BudgetController'
import GoalController from './GoalController'
import FixedAssetController from './FixedAssetController'
import DebtController from './DebtController'
import RecurringTemplateController from './RecurringTemplateController'
import ReportController from './ReportController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
WalletTransferController: Object.assign(WalletTransferController, WalletTransferController),
WalletController: Object.assign(WalletController, WalletController),
TransactionController: Object.assign(TransactionController, TransactionController),
CategoryController: Object.assign(CategoryController, CategoryController),
BudgetController: Object.assign(BudgetController, BudgetController),
GoalController: Object.assign(GoalController, GoalController),
FixedAssetController: Object.assign(FixedAssetController, FixedAssetController),
DebtController: Object.assign(DebtController, DebtController),
RecurringTemplateController: Object.assign(RecurringTemplateController, RecurringTemplateController),
ReportController: Object.assign(ReportController, ReportController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers