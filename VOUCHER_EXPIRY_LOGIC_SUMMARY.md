# Voucher Expiry Logic System Summary

## Overview
This document describes the comprehensive voucher expiry logic implemented in the Billiard Shop system, covering both backend routes and frontend components. The system ensures automatic cleanup of expired vouchers while providing users with accurate, up-to-date voucher information.

## Backend Logic (Server/routes/voucherRoutes.js)

### Key Features
1. **Automatic Cleanup on Request**: Expired vouchers are automatically removed from the database whenever voucher-related endpoints are accessed
2. **Consistent Validation**: All voucher operations use the same expiry check: `new Date(v.expiryDate) >= now`
3. **Immediate Removal**: When an expired voucher is detected during any operation, it's immediately removed from the user's voucher array

### Route-Specific Logic

#### POST /vouchers/apply
- **Purpose**: Apply a voucher to a shopping cart
- **Expiry Handling**:
  1. Pre-application cleanup: Removes all expired vouchers from user's collection (lines 14-20)
  2. Voucher lookup: Finds the specific voucher by code
  3. Expiry validation: Checks if the voucher is expired and removes it if so (lines 33-39)
  4. Returns error if voucher is expired/not found

#### GET /vouchers/mine
- **Purpose**: Retrieve user's voucher collection
- **Expiry Handling**:
  1. Pre-retrieval cleanup: Removes all expired vouchers (lines 81-87)
  2. Returns cleaned voucher list with count of removed items
  3. Sorts active vouchers by expiry date (closest expiry first)

#### PUT /vouchers/use/:code
- **Purpose**: Mark a voucher as used after order completion
- **Expiry Handling**:
  1. Voucher lookup by code
  2. Expiry check: If expired, removes voucher and returns error (lines 124-129)
  3. Marks voucher as used if valid

#### DELETE /vouchers/:code
- **Purpose**: User-initiated voucher deletion
- **Expiry Handling**: None (relies on user action; expired vouchers can still be manually deleted)

### Technical Implementation
- Uses `new Date(v.expiryDate)` for consistent date comparison
- Cleanup performed via `Array.filter()` method
- Changes persisted with `await user.save()` after modification
- Cleanup count returned in `/vouchers/mine` response for frontend awareness

## Frontend Logic (Client/pages/ProfileVoucher.jsx)

### Key Features
1. **Data Synchronization**: Relies on backend-cleaned data from `/vouchers/mine`
2. **Local Categorization**: Further organizes vouchers into active/used/expired for display
3. **Time Display**: Shows remaining time for active vouchers
4. **User Actions**: Allows deletion of any voucher (active, used, or expired)

### Component-Specific Logic

#### Data Fetching & Initial Processing
- Fetches vouchers via `API.get('/vouchers/mine')` (line 30)
- Backend already removed expired vouchers, but frontend re-checks for UI categorization

#### Voucher Categorization (lines 105-107)
```javascript
const activeVouchers = vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) >= new Date());
const usedVouchers = vouchers.filter(v => v.isUsed);
const expiredVouchers = vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) < new Date());
```

#### Time Remaining Calculation
- Function `getTimeRemaining(expiryDate)` calculates days/hours until expiry
- Returns null if already expired (line 19)
- Used to display "Còn X ngày Y giờ" for active vouchers (lines 168-172)

#### Display Logic
- **Active Vouchers**: Show time remaining, copy button, delete button
- **Used Vouchers**: Show "Đã sử dụng" overlay, copy button only
- **Expired Vouchers**: Show "Đã hết hạn" overlay, delete button only

#### User Actions
- **Delete**: Available for active and expired vouchers (lines 50-58)
- **Copy**: Available for all voucher types (lines 44-48)

### Related Frontend Components

#### Checkout.jsx (pages/Checkout.jsx)
- Applies vouchers via `/vouchers/apply` endpoint
- Handles success/error messages from backend expiry validation
- No local expiry logic (relies entirely on backend)

#### Header.jsx (components/Header.jsx)
- Displays voucher count: `{user.vouchers?.length || 0}`
- Relies on backend-maintained voucher array length

#### LuckyWheel.jsx (pages/LuckyWheel.jsx)
- Defines voucher prizes for wheel spins
- No expiry logic (vouchers gain expiry dates when awarded to users)

## System Workflow

### Voucher Lifecycle
1. **Creation**: User wins voucher from Lucky Wheel → stored with expiry date
2. **Storage**: Voucher remains in user's collection until used or expired
3. **Access**: Any voucher endpoint access triggers automatic cleanup
4. **Validation**: Before use, system verifies voucher is not expired
5. **Expiry**: Expired vouchers are removed on next system access
6. **Manual Removal**: Users can delete any voucher at any time

### Data Flow Example
1. User visits `/profile/vouchers`
2. Frontend calls `GET /vouchers/mine`
3. Backend:
   - Finds user
   - Removes all expired vouchers from database
   - Returns cleaned voucher list
4. Frontend:
   - Receises cleaned data
   - Further categorizes for display (active/used/expired)
   - Shows time remaining for active vouchers
   - Displays appropriate UI for each category

### API Response Structure
From `GET /vouchers/mine`:
```json
{
  "vouchers": [/* cleaned voucher array */],
  "cleaned": 3  // Number of expired vouchers removed
}
```

## Consistency Measures

### Shared Logic Patterns
1. **Date Comparison**: All components use `new Date(date)` for consistent parsing
2. **Expiry Check**: Uniform pattern `new Date(v.expiryDate) >= new Date()` for active checks
3. **Cleanup Approach**: Filter-based removal rather than individual deletion
4. **Error Messaging**: Consistent Vietnamese messages for expired vouchers

### Security & Reliability
1. **Double Validation**: Both frontend and backend check expiry (defense in depth)
2. **Automatic Cleanup**: Prevents accumulation of expired data
3. **Atomic Operations**: Cleanup and validation happen in single database transaction
4. **User Feedback**: Clear messaging when expired vouchers are encountered

## Benefits of Current Implementation

1. **Performance**: Expired vouchers are removed proactively, reducing database size
2. **Accuracy**: Users never see expired vouchers as "available" for use
3. **Experience**: Clear visual distinction between active, used, and expired vouchers
4. **Maintenance**: Centralized expiry logic in backend reduces frontend complexity
5. **Transparency**: Frontend shows count of cleaned expired vouchers

## Potential Improvements

1. **Background Cleanup**: Implement periodic cleanup job for inactive users
2. **Expiry Notifications**: Alert users when vouchers are approaching expiry
3. **Extension Options**: Allow voucher expiry extension under certain conditions
4. **Analytics**: Track voucher usage/expiry rates for business insights

## Conclusion
The voucher expiry logic creates a robust, user-friendly system that maintains data integrity while providing clear feedback to users. The combination of automatic backend cleanup and intelligent frontend presentation ensures users always interact with relevant, valid voucher information.