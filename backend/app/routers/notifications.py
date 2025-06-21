from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.models.schemas import Notification, User
from app.services.notification_service import NotificationService
from app.core.dependencies import get_current_user

router = APIRouter()
notification_service = NotificationService()

@router.get("/", response_model=List[Notification])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[str] = Query(None),
    notification_type: Optional[str] = Query(None)
):
    """Get user notifications"""
    return await notification_service.get_user_notifications(
        str(current_user.id), limit, offset, status, notification_type
    )

@router.get("/unread-count")
async def get_unread_count(current_user: User = Depends(get_current_user)):
    """Get count of unread notifications"""
    count = await notification_service.get_unread_count(str(current_user.id))
    return {"unread_count": count}

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark notification as read"""
    success = await notification_service.mark_notification_read(notification_id, str(current_user.id))
    if success:
        return {"message": "Notification marked as read"}
    else:
        return {"message": "Notification not found or already read"}

@router.put("/mark-all-read")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    """Mark all notifications as read"""
    count = await notification_service.mark_all_read(str(current_user.id))
    return {"message": f"{count} notifications marked as read"}

