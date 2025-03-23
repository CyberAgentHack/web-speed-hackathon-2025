-- recommendedModuleのインデックス
CREATE INDEX idx_recommended_module_reference_id ON recommendedModule(referenceId);
CREATE INDEX idx_recommended_module_order ON recommendedModule(order);

-- recommendedItemのインデックス
CREATE INDEX idx_recommended_item_module_id ON recommendedItem(moduleId);
CREATE INDEX idx_recommended_item_order ON recommendedItem(order);
CREATE INDEX idx_recommended_item_series_id ON recommendedItem(seriesId);
CREATE INDEX idx_recommended_item_episode_id ON recommendedItem(episodeId);

-- episodeのインデックス
CREATE INDEX idx_episode_order ON episode(order);
CREATE INDEX idx_episode_series_id ON episode(seriesId);

-- seriesのインデックス
CREATE INDEX idx_series_id ON series(id); 