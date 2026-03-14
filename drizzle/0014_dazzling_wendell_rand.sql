CREATE INDEX "invitation_inviterId_idx" ON "invitation" USING btree ("inviter_id");--> statement-breakpoint
CREATE INDEX "notification_actorId_idx" ON "notification" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "shareLink_expiresAt_idx" ON "share_link" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "subscription_polarCustomerId_idx" ON "subscription" USING btree ("polar_customer_id");