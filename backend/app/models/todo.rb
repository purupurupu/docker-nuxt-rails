class Todo < ApplicationRecord
    validates :title, presence: true
    validates :completed, inclusion: { in: [true, false] }

    default_scope { order(position: :asc) }
    before_create :set_position
end
